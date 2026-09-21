import { BaseApiClient } from './base-client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export class AuthClient extends BaseApiClient {
  register(payload: RegisterPayload) {
    return this.post('/api/auth/register', payload);
  }
}