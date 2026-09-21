import { BaseApiClient } from './base-client';

export interface CreateOAuthClientPayload {
  name: string;
  grants: string[];
  scopes: string[];
}

export class OAuthClient extends BaseApiClient {
  passwordGrant(email: string, password: string, scope?: string) {
    return this.post('/api/oauth/token', {
      grant_type: 'password',
      email,
      password,
      ...(scope ? { scope } : {}),
    });
  }

  clientCredentialsGrant(clientId: string, clientSecret: string, scope?: string) {
    return this.post('/api/oauth/token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      ...(scope ? { scope } : {}),
    });
  }

  refreshGrant(refreshToken: string) {
    return this.post('/api/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
  }

  userinfo() {
    return this.get('/api/oauth/userinfo');
  }

  createClient(payload: CreateOAuthClientPayload) {
    return this.post('/api/oauth/clients', payload);
  }

  revoke(refreshToken: string) {
    return this.post('/api/oauth/revoke', 
      { token: refreshToken });
  }

  deleteClient(clientId: string){
    return this.delete(`/api/oauth/clients/${clientId}`);
  }
}
