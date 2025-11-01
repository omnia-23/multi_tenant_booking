import { tenants } from '@/tenant/tenant.schema';
import { pgTable, uuid, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/database/database.utils';

// Spaces table
export const spaces = pgTable('spaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenant_id: uuid('tenant_id').references(() => tenants.id),
  name: varchar('name', { length: 255 }).notNull(),
  is_active: boolean('is_active').default(true),
  ...timestamps,
});

export const spaceAvailabilities = pgTable('space_availabilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenant_id: uuid('tenant_id')
    .references(() => tenants.id)
    .notNull(),
  space_id: uuid('space_id')
    .references(() => spaces.id)
    .notNull(),
  weekday: integer('weekday').notNull(), // weekly recurring: 0=Sunday .. 6=Saturday
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  ...timestamps,
});
