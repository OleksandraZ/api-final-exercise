import 'dotenv/config';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
export const REGULAR_USER_EMAIL = process.env.REGULAR_USER_EMAIL!;
export const REGULAR_USER_PASSWORD = process.env.REGULAR_USER_PASSWORD!;
export const FULL_PROMO = process.env.FULL_PROMO || 'WELCOME100';
export const HALF_PROMO = process.env.HALF_PROMO || 'HALF-OFF';
export const CLIENT_ID = process.env.CLIENT_ID!;
export const CLIENT_SECRET = process.env.CLIENT_SECRET!;

