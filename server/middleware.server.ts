import { createMiddleware } from 'hono/factory';
import { pathToRegexp } from 'path-to-regexp';
import { getSession } from 'remix-hono/session';
import { AUTH_SESSION_KEY, FlashData, SessionData } from './session.server';
import { getMe } from '~/modules/auth/service.server';

export function protect({
  protectedPaths,
  onFailRedirectTo,
}: {
  protectedPaths: string[];
  onFailRedirectTo: string;
}) {
  return createMiddleware(async (ctx, next) => {
    const isProtected = pathMatch(protectedPaths, ctx.req.path);

    if (!isProtected) {
      return next();
    }

    const session = getSession<SessionData, FlashData>(ctx);
    const auth = session.get(AUTH_SESSION_KEY);

    if (!auth) {
      session.flash(
        'errorMessage',
        'This content is only available to logged in users.'
      );

      return ctx.redirect(`${onFailRedirectTo}?redirectTo=${ctx.req.path}`);
    }

    try {
      const profile = await getMe(auth.accessToken);
      session.set(AUTH_SESSION_KEY, {
        accessToken: auth.accessToken,
        user: {
          id: profile.data.id,
          email: profile.data.email,
          name: profile.data.name,
          image: profile.data.image,
          status: profile.data.status,
          createdAt: profile.data.createdAt,
          updatedAt: profile.data.updatedAt,
        },
      });
    } catch (error) {
      session.flash(
        'errorMessage',
        'Session might have expired. Please log in again.'
      );

      session.unset(AUTH_SESSION_KEY);

      return ctx.redirect(`${onFailRedirectTo}?redirectTo=${ctx.req.path}`);
    }

    return next();
  });
}

function pathMatch(paths: string[], requestPath: string) {
  for (const path of paths) {
    const { regexp } = pathToRegexp(path);

    if (regexp.test(requestPath)) {
      return true;
    }
  }

  return false;
}
