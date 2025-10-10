import axios, { AxiosInstance } from 'axios';

interface CMS12ClientConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  debug?: boolean;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ContentItem {
  contentLink?: {
    id: number;
    workId?: number;
    guidValue?: string;
  };
  name?: string;
  language?: {
    name: string;
    displayName?: string;
  };
  contentType?: string[];
  properties?: Record<string, any>;
  [key: string]: any;
}

interface ContentType {
  id?: number;
  name?: string;
  displayName?: string;
  description?: string;
  baseType?: string;
  properties?: Array<{
    name: string;
    dataType: string;
    displayName?: string;
    required?: boolean;
  }>;
  [key: string]: any;
}

/**
 * Client for Optimizely CMS 12 (PaaS/Self-hosted) Content Management API v3.0
 * Uses OpenID Connect authentication with client credentials flow
 */
export class OptimizelyCMS12Client {
  private config: CMS12ClientConfig;
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: CMS12ClientConfig) {
    this.config = config;

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to ensure valid token
    this.axiosInstance.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  /**
   * Authenticate using OpenID Connect client credentials flow
   */
  private async authenticate(): Promise<void> {
    try {
      const tokenUrl = `${this.config.baseUrl}/api/episerver/connect/token`;

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.config.clientId);
      params.append('client_secret', this.config.clientSecret);

      if (this.config.debug) {
        console.log('CMS 12 Authentication Request:', {
          url: tokenUrl,
          clientId: this.config.clientId,
        });
      }

      const response = await axios.post<TokenResponse>(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;

      // Set token expiry with 30-second buffer (default is 300 seconds = 5 minutes)
      const expiresIn = response.data.expires_in || 300;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 30) * 1000);

      if (this.config.debug) {
        console.log('CMS 12 Authentication Successful', {
          tokenType: response.data.token_type,
          expiresIn: response.data.expires_in,
          expiryTime: this.tokenExpiry.toISOString(),
        });
      }
    } catch (error: any) {
      if (this.config.debug) {
        console.error('CMS 12 Authentication Failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      throw new Error(`CMS 12 authentication failed: ${error.message}`);
    }
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureValidToken(): Promise<void> {
    const needsNewToken = !this.accessToken ||
                          !this.tokenExpiry ||
                          new Date() >= this.tokenExpiry;

    if (needsNewToken) {
      await this.authenticate();
    }
  }

  /**
   * Get content by content ID
   */
  async getContentById(contentId: number | string, locale?: string): Promise<ContentItem> {
    try {
      const url = `/api/episerver/v3.0/contentmanagement/${contentId}`;
      const params = locale ? { language: locale } : {};

      const response = await this.axiosInstance.get<ContentItem>(url, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get content: ${error.message}`);
    }
  }

  /**
   * Create new content
   */
  async createContent(payload: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const url = '/api/episerver/v3.0/contentmanagement';
      const response = await this.axiosInstance.post<ContentItem>(url, payload);
      return response.data;
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      if (this.config.debug) {
        console.error('Create content error:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error(`Failed to create content: ${JSON.stringify(errorDetails)}`);
    }
  }

  /**
   * Update content (PATCH - partial update)
   */
  async updateContent(contentId: number | string, payload: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const url = `/api/episerver/v3.0/contentmanagement/${contentId}`;
      const response = await this.axiosInstance.patch<ContentItem>(url, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update content: ${error.message}`);
    }
  }

  /**
   * Delete content
   */
  async deleteContent(contentId: number | string): Promise<void> {
    try {
      const url = `/api/episerver/v3.0/contentmanagement/${contentId}`;
      await this.axiosInstance.delete(url);
    } catch (error: any) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }
  }

  /**
   * List all content types
   */
  async listContentTypes(): Promise<ContentType[]> {
    try {
      const url = '/api/episerver/v3.0/contenttypes';
      const response = await this.axiosInstance.get<ContentType[]>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list content types: ${error.message}`);
    }
  }

  /**
   * Get specific content type by ID
   */
  async getContentType(contentTypeId: number | string): Promise<ContentType> {
    try {
      const url = `/api/episerver/v3.0/contenttypes/${contentTypeId}`;
      const response = await this.axiosInstance.get<ContentType>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get content type: ${error.message}`);
    }
  }

  /**
   * Create new content type
   */
  async createContentType(payload: Partial<ContentType>): Promise<ContentType> {
    try {
      const url = '/api/episerver/v3.0/contenttypes';
      const response = await this.axiosInstance.post<ContentType>(url, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create content type: ${error.message}`);
    }
  }

  /**
   * Update content type
   */
  async updateContentType(contentTypeId: number | string, payload: Partial<ContentType>): Promise<ContentType> {
    try {
      const url = `/api/episerver/v3.0/contenttypes/${contentTypeId}`;
      const response = await this.axiosInstance.put<ContentType>(url, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update content type: ${error.message}`);
    }
  }

  /**
   * Delete content type
   */
  async deleteContentType(contentTypeId: number | string): Promise<void> {
    try {
      const url = `/api/episerver/v3.0/contenttypes/${contentTypeId}`;
      await this.axiosInstance.delete(url);
    } catch (error: any) {
      throw new Error(`Failed to delete content type: ${error.message}`);
    }
  }
}
