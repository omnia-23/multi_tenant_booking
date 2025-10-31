import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  updated_at: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
