import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { AuthSession } from 'server/session.server';
import { PanelHeader } from '~/common/components/modules/panel/PanelHeader';
import { PanelSidebar } from '~/common/components/modules/panel/PanelSidebar';

export async function loader({ context }: LoaderFunctionArgs) {
  return context.getSession();
}

export default function Screen() {
  const session = useLoaderData<AuthSession>();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <PanelSidebar />
      <div className="flex flex-col">
        <PanelHeader user={session.user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          <Outlet context={session.user} />
        </main>
      </div>
    </div>
  );
}
