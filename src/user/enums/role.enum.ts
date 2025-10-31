export const Roles = ['super_admin', 'user', 'admin'] as const;
export type Role = (typeof Roles)[number];
export const Role = {
  Super_Admin: 'super_admin' as Role,
  User: 'user' as Role,
  Admin: 'admin' as Role,
};
