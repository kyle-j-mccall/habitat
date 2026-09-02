import { healthResponseSchema, type HealthResponse } from '@habitat/shared';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiUrl}/health`);

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  return healthResponseSchema.parse(await response.json());
}
