import { Config, defineConfig } from 'drizzle-kit';
// @ts-expect-error - This is a valid configuration
const config: Config = {
  schema: process.env.NODE_ENV === 'development' ? './src/**/*.schema.ts' : './dist/**/*.schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: false,
  },
};

export default defineConfig(config);
