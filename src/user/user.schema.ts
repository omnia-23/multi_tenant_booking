import { pgEnum, pgTable, uniqueIndex, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/database/database.utils';
import { Role, Roles } from './enums/role.enum';

// Database enum
export const userRolesEnum = pgEnum('user_role_enum', Roles);

export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role: userRolesEnum().notNull().default(Role.User),
    refresh_token: text(),
    ...timestamps,
  },
  table => [uniqueIndex('emailIndex').onOnly(table.email)],
);
