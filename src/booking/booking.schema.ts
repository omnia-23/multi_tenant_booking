import { spaces } from '@/spaces/space.schema';
import { tenants } from '@/tenant/tenant.schema';
import { users } from '@/user/user.schema';
import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/database/database.utils';

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenant_id: uuid('tenant_id')
    .references(() => tenants.id)
    .notNull(),
  space_id: uuid('space_id')
    .references(() => spaces.id)
    .notNull(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  start_at: timestamp('start_at').notNull(),
  end_at: timestamp('end_at').notNull(),
  ...timestamps,
});
