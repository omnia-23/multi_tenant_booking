import { PgColumn, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { and, isNull, SQL } from 'drizzle-orm';

// Helper function to check if a table has a deleted_at column
export const hasSoftDeleteColumn = (table: PgTable) => (table as any).deleted_at instanceof PgColumn;

export function filterSoftDelete<T extends PgSelect>(qb: T, excludedTablesList: PgTable[] = []): T {
  const queryConfig = (
    qb as unknown as { config: { table: PgTable<any>; joins: Array<{ table: PgTable<any> }>; where: SQL | undefined } }
  ).config;

  const conditions: SQL[] = [];
  const tables: Array<PgTable> = [];

  // Add main table
  if (queryConfig.table) {
    tables.push(queryConfig.table);
  }

  // Add joined tables
  if (queryConfig.joins) {
    queryConfig.joins.forEach(join => {
      if (join.table) {
        tables.push(join.table);
      }
    });
  }

  // Add soft delete conditions for tables with a deleted_at column
  tables.forEach(table => {
    if (hasSoftDeleteColumn(table) && !excludedTablesList.includes(table)) {
      conditions.push(isNull(table['deleted_at']));
    }
  });

  // Combine existing where conditions with soft delete conditions
  const existingConditions = queryConfig.where ? [queryConfig.where] : [];
  const updatedQuery = qb.where(and(...existingConditions, ...conditions));

  return updatedQuery as T;
}
