import { createCookieSessionStorage } from '@remix-run/node';
import { GetMeResponse } from '~/modules/auth/type';

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  user: GetMeResponse;
};

export const AUTH_SESSION_KEY = 'auth';

export type SessionData = {
  [AUTH_SESSION_KEY]: AuthSession;
};

export type FlashData = { errorMessage: string };

export function createSessionStorage() {
  return createCookieSessionStorage({
    cookie: {
      name: '__authSession',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET || '@i^c{iTrfg^L&,Zn|;$1?:!e#!t^LA'],
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
