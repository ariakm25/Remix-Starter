import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from 'react-router';
import { authenticator } from '~/modules/auth/service.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/panel',
  });
}

export default function Screen() {
  return <Outlet />;
}
