import type { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly token?: string,
  ) {}

  private get headers(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  protected get(path: string): Promise<APIResponse> {
    return this.request.get(path, { headers: this.headers });
  }

  protected post(path: string, data?: unknown): Promise<APIResponse> {
    return this.request.post(path, { headers: this.headers, data });
  }

  protected patch(path: string, data?: unknown): Promise<APIResponse> {
    return this.request.patch(path, { headers: this.headers, data });
  }

  protected delete(path: string): Promise<APIResponse> {
    return this.request.delete(path, { headers: this.headers });
  }
}
