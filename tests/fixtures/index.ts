import { test as base, expect } from '@playwright/test';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

type Fixtures = {
  adminToken: string;
  userToken: string;
};

async function readToken(filePath: string): Promise<string>{
    const tokenFilePath = path.resolve(
    process.cwd(),
    filePath,
    );

    const fileContent = await readFile(tokenFilePath, 'utf-8');
    const { accessToken } = JSON.parse(fileContent);

    if (!accessToken) {
        throw new Error('User access token is missing');
    }
    return accessToken
}

export const test = base.extend<Fixtures>({
  adminToken: async ({}, use) => {
    const accessToken = await readToken('.auth/admin-token.json')
    await use(accessToken);
    },

  userToken: async ({}, use) => {
    const accessToken = await readToken('.auth/user-token.json')
    await use(accessToken);
    }
});

export { expect };