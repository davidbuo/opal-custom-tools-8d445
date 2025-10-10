import axios from 'axios';

interface PreviewUrlRequest {
  contentKey: string;
  contentVersion: string;
  pageUrl: string;
}

interface PreviewUrlResponse {
  previewUrl: string;
  token: string;
  expiresIn: string;
}

async function testPreviewUrl(
  domain: string,
  contentKey: string,
  contentVersion: string,
  pageUrl: string,
  secretToken?: string
) {
  const apiUrl = `${domain}/api/preview-url.json`;

  const requestBody: PreviewUrlRequest = {
    contentKey,
    contentVersion,
    pageUrl,
  };

  console.log('\n=== Testing Preview URL API ===');
  console.log('API Endpoint:', apiUrl);
  console.log('Request Body:', JSON.stringify(requestBody, null, 2));

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add secret token to headers if provided
    if (secretToken) {
      headers['Authorization'] = `Bearer ${secretToken}`;
      console.log('Using Authorization Token');
    }

    const response = await axios.post<PreviewUrlResponse>(apiUrl, requestBody, {
      headers,
    });

    console.log('\n=== Response ===');
    console.log('Status:', response.status);
    console.log('Preview URL:', response.data.previewUrl);
    console.log('Token:', response.data.token);
    console.log('Expires In:', response.data.expiresIn);

    return response.data;
  } catch (error: any) {
    console.error('\n=== Error ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
}

// Main execution
async function main() {
  // Replace these with your actual values
  const domain = 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com'; // Your CMS domain
  const contentKey = ''; // Will be provided by user
  const contentVersion = ''; // Will be provided by user
  const pageUrl = '/en/test-page/'; // Example page URL
  const secretToken = ''; // Optional secret token if required

  if (!contentKey || !contentVersion) {
    console.log('\nPlease provide contentKey and contentVersion in the script.');
    console.log('Usage: Update the contentKey and contentVersion variables in main()');
    return;
  }

  await testPreviewUrl(domain, contentKey, contentVersion, pageUrl, secretToken);
}

// Allow running with command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length >= 2) {
    const domain = 'https://nestly.opti-demo.com';
    const contentKey = args[0];
    const contentVersion = args[1];
    const pageUrl = args[2] || '/en/test-page/';
    const secretToken = 'OptiPreview123';

    testPreviewUrl(domain, contentKey, contentVersion, pageUrl, secretToken)
      .then(() => console.log('\n✅ Test completed successfully'))
      .catch(() => console.log('\n❌ Test failed'));
  } else {
    main()
      .then(() => console.log('\n✅ Test completed successfully'))
      .catch(() => console.log('\n❌ Test failed'));
  }
}

export { testPreviewUrl };
