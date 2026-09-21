import { test, expect } from './fixtures'
import { AuthClient } from './api/auth-client'
import { userSchema, expectSchema } from './schemas'
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const databaseUrl = process.env.DATABASE_URL!;
const dbUrl = databaseUrl.replace(/^mysql:\/\//, 'mariadb://');
const adapter = new PrismaMariaDb(dbUrl);
const prisma = new PrismaClient({ adapter });

let createdUserId: string | undefined;

test.afterEach(async () => {
  try {
    if (createdUserId) {
      await prisma.user.delete({
        where: {
          id: createdUserId,
        },
      });
    }
  } finally {
    createdUserId = undefined;
  }
});

test ('successful registration', async ( {request} ) => {
    const uniqueEmail = `user-${Date.now()}@test.com`
    const uniqueName = `user-${Date.now()}`
    const uniquePassword = `Password-${Date.now()}`

    const authClient = new AuthClient(request)

    const userResponse = await authClient.register(
        {
            name: uniqueName, 
            email: uniqueEmail, 
            password: uniquePassword
        }
    )
    const user = await userResponse.json();
    createdUserId = user.id;

    expect(userResponse).toBeOK();
    expect(userResponse.status()).toBe(201);

    expect(user.email).toBe(uniqueEmail); 
    expect(user.name).toBe(uniqueName);

    expectSchema(user, userSchema)

    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('hashedPassword');
});

test ('duplicate email is rejected', async ({request}) => {
    const uniqueEmail = `user-${Date.now()}@test.com`
    const uniqueName = `user-${Date.now()}`
    const uniquePassword = `Password-${Date.now()}`

    const authClient = new AuthClient(request)

    const firstResponse = await authClient.register(
        {
            name: uniqueName, 
            email: uniqueEmail, 
            password: uniquePassword
        }
    )
    const user = await firstResponse.json();
    createdUserId = user.id;

    expect(firstResponse).toBeOK();

    const duplicateResponse = await authClient.register(
        {
            name: uniqueName, 
            email: uniqueEmail, 
            password: uniquePassword
        }
    )

    expect(duplicateResponse.status()).toBe(409);
    const body = await duplicateResponse.json(); 
    expect(body.error).toBe('Email already registered');

})