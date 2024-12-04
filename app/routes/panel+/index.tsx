import { MetaFunction, useOutletContext } from '@remix-run/react';
import { AuthSession } from 'server/session.server';

export default function Screen() {
  const user = useOutletContext<AuthSession['user']>();
  return <div>Pagi lort {user.name}</div>;
}

export const meta: MetaFunction = () => {
  return [{ title: `Dashboard` }];
};
