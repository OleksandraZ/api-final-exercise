import { ADMIN_EMAIL, ADMIN_PASSWORD, REGULAR_USER_EMAIL, REGULAR_USER_PASSWORD } from './tests/config';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  request,
  type FullConfig,
} from '@playwright/test';

import { OAuthClient } from './tests/api/oauth-client';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

async function loginAndSaveToken(
  client: OAuthClient, 
  email: string, 
  password: string, 
  filePath: string): Promise<void> {

    const response = await client.passwordGrant(
      email,
      password,
      'read write',
    );

    if (!response.ok()) {
      throw new Error(
        `Authentication failed: ${response.status()} ${await response.text()}`,
      );
    }

    const tokenResponse =
      (await response.json()) as TokenResponse;

    const authFile = path.resolve(filePath);

    await mkdir(path.dirname(authFile), {
      recursive: true,
    });

    await writeFile(
      authFile,
      JSON.stringify(
        {
          accessToken: tokenResponse.access_token,
          tokenType: tokenResponse.token_type,
          expiresIn: tokenResponse.expires_in,
          scope: tokenResponse.scope,
        },
        null,
        2,
      ),
    );
  }


async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0].use.baseURL;

  if (!baseURL) {
    throw new Error('baseURL is not defined');
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !REGULAR_USER_PASSWORD || !REGULAR_USER_EMAIL) {
    throw new Error(
      'EMAIL AND PASSWORD must be defined',
    );
  }

  const requestContext = await request.newContext({
    baseURL,
  });

  try {
    const oauthClient = new OAuthClient(requestContext);
    await loginAndSaveToken(
      oauthClient,
      ADMIN_EMAIL, 
      ADMIN_PASSWORD, 
      ".auth/admin-token.json")

    await loginAndSaveToken(
      oauthClient,
      REGULAR_USER_EMAIL, 
      REGULAR_USER_PASSWORD, 
      ".auth/user-token.json")
  } finally {
    await requestContext.dispose();
  }
}

export default globalSetup;