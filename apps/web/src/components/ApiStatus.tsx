import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../lib/api';

export function ApiStatus() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth });

  if (health.isPending) return <p>Checking API connection…</p>;
  if (health.isError) return <p className="error">API connection: unavailable</p>;

  return <p className="success">API connection: healthy</p>;
}
