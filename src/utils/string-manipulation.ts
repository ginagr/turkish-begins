export const formatScreamSnakeCase = (f: string): string => {
  const lower = f.toLowerCase();
  const spaces = lower.replace('_', ' ');
  const cuisine = spaces.replace('country', 'turkish');
  return cuisine;
};
