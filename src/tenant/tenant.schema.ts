import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/database/database.utils';

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...timestamps,
});
