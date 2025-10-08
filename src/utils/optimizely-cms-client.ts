import axios, { AxiosInstance } from 'axios';

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface OptimizelyConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export class OptimizelyApiClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private axiosInstance: AxiosInstance;

  constructor(config: OptimizelyConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = config.baseUrl;
    this.axiosInstance = axios.create();
  }

  /**
   * Normalize content key by removing dashes
   * Optimizely API requires keys without dashes
   */
  private normalizeContentKey(key: string): string {
    return key.replace(/-/g, '');
  }

  /**
   * Authenticate with Optimizely CMS API and get access token
   */
  private async authenticate(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid (with 30 second buffer)
    if (this.accessToken && this.tokenExpiry > now + 30000) {
      return this.accessToken;
    }

    try {
      const response = await this.axiosInstance.post<AuthResponse>(
        'https://api.cms.optimizely.com/oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get content by content key
   */
  async getContentByKey(contentKey: string): Promise<any> {
    const token = await this.authenticate();
    const normalizedKey = this.normalizeContentKey(contentKey);

    try {
      const response = await this.axiosInstance.get(
        `https://api.cms.optimizely.com/preview3/experimental/content/${normalizedKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get content: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Update content by content key and version
   * Uses JSON Merge Patch (RFC 7386) to update only specified fields
   */
  async updateContent(contentKey: string, versionId: number, updates: any): Promise<any> {
    const token = await this.authenticate();
    const normalizedKey = this.normalizeContentKey(contentKey);

    try {
      const response = await this.axiosInstance.patch(
        `https://api.cms.optimizely.com/preview3/experimental/content/${normalizedKey}/versions/${versionId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/merge-patch+json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Failed to update content: ${errorDetail}`);
    }
  }

  /**
   * List child content items under a parent content key
   */
  async listContentItems(parentContentKey: string, contentTypes?: string[], pageIndex: number = 0, pageSize: number = 25): Promise<any> {
    const token = await this.authenticate();
    const normalizedKey = this.normalizeContentKey(parentContentKey);

    try {
      const params: any = {
        pageIndex,
        pageSize,
      };

      if (contentTypes && contentTypes.length > 0) {
        params.contentTypes = contentTypes.join(',');
      }

      const response = await this.axiosInstance.get(
        `https://api.cms.optimizely.com/preview3/experimental/content/${normalizedKey}/items`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Failed to list content items: ${errorDetail}`);
    }
  }

  /**
   * Create a new content item
   */
  async createContent(params: {
    contentType: string;
    container: string;
    locale?: string;
    displayName: string;
    status?: 'draft' | 'published';
    properties?: any;
  }): Promise<any> {
    const token = await this.authenticate();

    // Generate a new UUID for the content key (without dashes)
    const contentKey = this.generateContentKey();

    // Container should be provided without dashes
    const requestBody: any = {
      key: contentKey,
      contentType: params.contentType,
      locale: params.locale || 'en',
      container: params.container, // Use as-is, should already be without dashes
      displayName: params.displayName,
      ...(params.properties && { properties: params.properties })
    };

    // Only add status if explicitly provided
    if (params.status) {
      requestBody.status = params.status;
    }

    try {
      const response = await this.axiosInstance.post(
        'https://api.cms.optimizely.com/preview3/experimental/content',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Failed to create content: ${errorDetail}`);
    }
  }

  /**
   * Generate a random content key (UUID without dashes)
   */
  private generateContentKey(): string {
    // Generate UUID v4 and remove dashes
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }

  /**
   * Get a specific content type by key
   */
  async getContentType(contentTypeKey: string): Promise<any> {
    const token = await this.authenticate();

    try {
      const response = await this.axiosInstance.get(
        `https://api.cms.optimizely.com/preview3/contenttypes/${contentTypeKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get content type: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all content types
   */
  async listContentTypes(pageIndex: number = 0, pageSize: number = 100): Promise<any> {
    const token = await this.authenticate();

    try {
      const response = await this.axiosInstance.get(
        'https://api.cms.optimizely.com/preview3/contenttypes',
        {
          params: {
            pageIndex,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list content types: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get content versions for a specific content key
   */
  async getContentVersions(contentKey: string, locales?: string[], statuses?: string[]): Promise<any> {
    const token = await this.authenticate();
    const normalizedKey = this.normalizeContentKey(contentKey);

    try {
      const params: any = {};

      if (locales && locales.length > 0) {
        params.locales = locales.join(',');
      }

      if (statuses && statuses.length > 0) {
        params.statuses = statuses.join(',');
      }

      const response = await this.axiosInstance.get(
        `https://api.cms.optimizely.com/preview3/experimental/content/${normalizedKey}/versions`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get content versions: ${error.response?.data?.message || error.message}`);
    }
  }
}
