import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/modules/auth/service.server';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  context.destroySession();
  await authenticator.logout(request, { redirectTo: '/auth/login' });
};

export const loader = () => redirect('/');
