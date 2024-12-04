// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import {
  AUTH_SESSION_KEY,
  AuthSession,
  createSessionStorage,
} from '../../../server/session.server';
import { FormStrategy } from 'remix-auth-form';
import fetcher from '~/common/utils/fetcher';
import { UnauthorizedError } from '~/common/utils/error';
import { GetMeResponse, LoginRequest, LoginResponse } from './type';

export const authenticator = new Authenticator<AuthSession>(
  createSessionStorage(),
  {
    sessionKey: AUTH_SESSION_KEY,
  }
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = JSON.parse(form.get('email') as string);
    const password = JSON.parse(form.get('password') as string);

    let user;

    try {
      user = await login({
        email,
        password,
      });
    } catch (error) {
      throw new UnauthorizedError('Invalid email or password');
    }

    try {
      const me = await getMe(user.data.token);

      return {
        accessToken: user.data.token,
        refreshToken: user.data.refresh_token,
        user: {
          id: me.data.id,
          email: me.data.email,
          name: me.data.name,
          image: me.data.image,
          status: me.data.status,
          createdAt: me.data.createdAt,
          updatedAt: me.data.updatedAt,
        },
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedError('Invalid email or password');
    }
  }),
  'email-pass'
);

export const login = (body: LoginRequest) => {
  return fetcher<LoginResponse, LoginRequest>({
    path: '/auth/login',
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getMe = (accessToken: string) => {
  return fetcher<GetMeResponse>({
    path: '/auth/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
