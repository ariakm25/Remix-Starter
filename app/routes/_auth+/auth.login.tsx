// app/routes/login.tsx
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Label } from '@radix-ui/react-label';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Input } from '~/common/components/ui/input';
import { LoginRequest, LoginSchema } from '../../modules/auth/type';
import { authenticator } from '../../modules/auth/service.server';

const resolver = valibotResolver(LoginSchema);

export async function action({ request, context }: ActionFunctionArgs) {
  const originalRequest = request.clone();
  const { errors, receivedValues: defaultValues } =
    await getValidatedFormData<LoginRequest>(request, resolver);

  if (errors) {
    return Response.json({ errors, defaultValues });
  }

  try {
    const loginUser = await authenticator.authenticate(
      'email-pass',
      originalRequest,
      {
        throwOnError: true,
      }
    );

    context.setSession(loginUser);

    return {
      name: loginUser.user.name,
      email: loginUser.user.email,
      image: loginUser.user.image,
    };
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message });
    }

    if (error instanceof AuthorizationError) {
      return Response.json({ error: error.message });
    }

    return Response.json({ error: 'An unknown error occurred' });
  }
}

export default function Screen() {
  const actionData = useActionData<{ error: string }>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isValidating },
    register,
  } = useRemixForm<LoginRequest>({
    mode: 'onSubmit',
    submitConfig: {
      method: 'post',
    },
    resolver,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting || isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isSubmitting || isLoading}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {actionData?.error && (
              <div className="text-red-500 text-sm">{actionData.error}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isValidating || isSubmitting}>
              Sign In
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: `Login` }];
};
