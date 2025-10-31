export const Roles = ['user', 'admin'] as const;
export type Role = (typeof Roles)[number];
export const Role = {
  User: 'user' as Role,
  Admin: 'admin' as Role,
};
