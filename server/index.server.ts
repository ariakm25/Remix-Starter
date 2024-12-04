import {
  createHonoServer,
  HonoServerOptions,
} from 'react-router-hono-server/node';
import { session, getSession } from 'remix-hono/session';
import {
  AUTH_SESSION_KEY,
  AuthSession,
  createSessionStorage,
  FlashData,
  SessionData,
} from './session.server';
import { AppLoadContext } from '@remix-run/node';
import { ForbiddenError } from '~/common/utils/error';
import { protect } from './middleware.server';
import { CheckEnv } from './env.server';

CheckEnv();

export const getLoadContext: HonoServerOptions['getLoadContext'] = (
  c,
  { build, mode }
) => {
  const session = getSession<SessionData, FlashData>(c);

  return {
    appVersion: mode === 'production' ? build.assets.version : 'dev',
    isAuthenticated: session.has(AUTH_SESSION_KEY),
    getSession: () => {
      const auth = session.get(AUTH_SESSION_KEY);

      if (!auth) {
        throw new ForbiddenError("You're not authenticated");
      }

      return auth;
    },
    setSession: (auth: AuthSession) => {
      session.set(AUTH_SESSION_KEY, auth);
    },
    destroySession: () => {
      session.unset(AUTH_SESSION_KEY);
    },
    errorMessage: session.get('errorMessage') || null,
  } satisfies AppLoadContext;
};

export const server = await createHonoServer({
  port: 4000,
  getLoadContext,
  configure: (server) => {
    /**
     * Add session middleware
     */
    server.use(
      session({
        autoCommit: true,
        createSessionStorage() {
          const sessionStorage = createSessionStorage();

          return {
            ...sessionStorage,
            // If a user doesn't come back to the app within 30 days, their session will be deleted.
            async commitSession(session) {
              return sessionStorage.commitSession(session, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
              });
            },
          };
        },
      })
    );
    /**
     * Add protected routes middleware
     *
     */
    server.use(
      protect({
        onFailRedirectTo: '/auth/login',
        protectedPaths: ['/panel', '/panel*any'],
      })
    );
  },
});

/**
 * Declare our loaders and actions context type
 */
declare module '@remix-run/node' {
  interface AppLoadContext {
    /**
     * The app version from the build assets
     */
    readonly appVersion: string;
    /**
     * Whether the user is authenticated or not
     */
    isAuthenticated: boolean;
    /**
     * Get the current session
     *
     * If the user is not logged it will throw an error
     *
     * @returns The session
     */
    getSession(): SessionData['auth'];
    /**
     * Set the session to the session storage
     *
     * It will then be automatically handled by the session middleware
     *
     * @param session - The auth session to commit
     */
    setSession(session: SessionData['auth']): void;
    /**
     * Destroy the session from the session storage middleware
     *
     * It will then be automatically handled by the session middleware
     */
    destroySession(): void;
    /**
     * The flash error message related to session
     */
    errorMessage: string | null;
  }
}
