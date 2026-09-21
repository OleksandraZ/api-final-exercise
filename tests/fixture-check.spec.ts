import { OAuthClient } from './api/oauth-client';
import { test, expect } from './fixtures';

test('admin token authenticates the admin user', async ({request, adminToken}) => {
    
    const oauthClient = new OAuthClient(request, adminToken);

    const response = await oauthClient.userinfo();

    expect(response).toBeOK();

    const user = await response.json();

    expect(user.role).toBe('ADMIN');
}); 

test('regular user token authenticates the user', async ({request, userToken}) => {
    
    const oauthClient = new OAuthClient(request, userToken);

    const response = await oauthClient.userinfo();

    expect(response).toBeOK();

    const user = await response.json();

    expect(user.role).toBe('USER');
}); 