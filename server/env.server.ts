import * as v from 'valibot';

export const EnvSchema = v.object({
  NODE_ENV: v.picklist(['development', 'production', 'test'] as const),
  API_URL: v.string(),
  SESSION_SECRET: v.string(),
});

export const CheckEnv = () => {
  const envData = v.safeParse(EnvSchema, process.env);

  if (envData.success) {
    console.log('✅ Environment variables loaded successfully');
  } else {
    console.error('❌ Environment variables failed to load');
    console.error(v.flatten<typeof EnvSchema>(envData.issues).nested);
    process.exit(1);
  }
};
