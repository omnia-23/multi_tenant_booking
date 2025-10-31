// drizzle/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/database/database.schema';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ...(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        ssl: false,
      }),
});

export const db = drizzle(pool, { schema });
