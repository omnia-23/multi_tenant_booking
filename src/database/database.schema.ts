import { getTableName, isTable } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import * as userSchema from '../user/user.schema';
import * as tenantSchema from '../tenant/tenant.schema';
import * as spaceSchema from '../spaces/space.schema';
import * as bookingSchema from '../booking/booking.schema';

const schemas = {
  ...userSchema,
  ...tenantSchema,
  ...spaceSchema,
  ...bookingSchema,
};

/**
 * List of tables
 */
export const tables = Object.values(schemas).filter(isTable) as PgTable[];

/**
 * List of table names
 */
export const tableNames = tables.map(getTableName);

/**
 * Map of table names to tables
 */
export const tablesMap: {
  [key: string]: PgTable;
} = tables.reduce((acc, table) => {
  acc[getTableName(table)] = table;
  return acc;
}, {});

export default schemas;
