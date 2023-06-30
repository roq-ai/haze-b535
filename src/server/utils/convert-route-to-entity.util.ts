const mapping: Record<string, string> = {
  commands: 'command',
  organizations: 'organization',
  users: 'user',
  'user-organizations': 'user_organization',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
