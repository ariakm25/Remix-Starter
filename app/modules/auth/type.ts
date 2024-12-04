import * as v from 'valibot';

export const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Email is required'),
    v.email('Email must be a valid email address')
  ),
  password: v.pipe(v.string(), v.nonEmpty('Password is required')),
});

export type LoginRequest = v.InferInput<typeof LoginSchema>;

export type LoginResponse = {
  token: string;
  refresh_token: string;
};

export type GetMeResponse = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};
