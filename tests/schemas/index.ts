import { z } from 'zod';
import { expect } from '@playwright/test';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.string(),
});

export const userInfoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

export const oauthClientSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  name: z.string(),
  grants: z.array(z.string()),
  scopes: z.array(z.string()),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  isPublished: z.boolean(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const courseListSchema = z.object({
  data: z.array(courseSchema),
  pagination: paginationSchema,
});

export function expectSchema<T>(data: unknown, schema: z.ZodType<T>): asserts data is T {
  const result = schema.safeParse(data);
  expect(result.success, result.success ? undefined : z.prettifyError(result.error)).toBe(true);
}
