import { PgColumn, PgSelect, PgText, PgVarchar } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ilike, or } from 'drizzle-orm';

export async function withPagination<T extends PgSelect>(
  qb: T,
  database: NodePgDatabase<any>,
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  const offset = (page - 1) * limit;

  if (search) {
    const searchColumns = extractSearchableColumns(qb._.selectedFields);
    qb.where(
      or(
        ...searchColumns.map(column => {
          return ilike(column, `%${search}%`);
        }),
      ),
    );
  }

  // Get total count
  const { sql: originalSql, params } = qb.toSQL();
  const countSql = interpolateQuery(originalSql, params);

  const [data, totalResult] = await Promise.all([
    // Get paginated results
    qb.limit(limit).offset(offset),

    // Execute count query with interpolated SQL
    database.execute(`SELECT COUNT(*) FROM (${countSql}) as count`),
  ]);

  const total = parseInt(totalResult.rows[0].count as string, 10);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

// Create a function to replace placeholders with actual values
const interpolateQuery = (query: string, parameters: any[]) => {
  return parameters.reduce((acc, param, index) => {
    // Replace $1, $2, etc. with the actual parameter values
    const placeholder = `$${index + 1}`;

    // Handle different types of parameters
    const replacementValue =
      param === null ? 'NULL' : typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;

    return acc.replace(placeholder, replacementValue);
  }, query);
};

type SelectedFields = {
  [key: string]: PgColumn | Record<string, PgColumn | Record<string, PgColumn>>;
};

// @ts-expect-error asd
function isSearchableColumn(field: any): field is PgText | PgVarchar {
  return field instanceof PgText || field instanceof PgVarchar;
}

function isPgColumn(field: any): field is PgColumn {
  return field instanceof PgColumn;
}

function extractSearchableColumns(selectedFields: SelectedFields): PgColumn[] {
  const processField = (field: any): PgColumn[] => {
    if (isPgColumn(field)) {
      return isSearchableColumn(field) ? [field] : [];
    }

    if (typeof field === 'object' && field !== null) {
      return Object.values(field).flatMap(processField);
    }

    return [];
  };

  return Object.values(selectedFields).flatMap(processField);
}
