import {
  healthResponseSchema,
  speciesListSchema,
  animalListSchema,
  enclosureListSchema,
  type HealthResponse,
  type Species,
  type CreateAnimalInput,
  type CreateEnclosureInput,
  type Animal,
  type Enclosure,
} from '@habitat/shared';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiUrl}/health`);

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  return healthResponseSchema.parse(await response.json());
}

export async function listSpecies(): Promise<Species[]> {
  const response = await fetch(`${apiUrl}/species`);

  if (!response.ok) {
    throw new Error(`Species request failed with status ${response.status}`);
  }

  return speciesListSchema.parse(await response.json());
}

export async function fetchAnimals(): Promise<Animal[]> {
  const response = await fetch(`${apiUrl}/animals`);

  if (!response.ok) {
    throw new Error(`Fetch animals request failed with status ${response.status}`);
  }

  return animalListSchema.parse(await response.json());
}

export async function listEnclosures(): Promise<Enclosure[]> {
  const response = await fetch(`${apiUrl}/enclosures`);

  if (!response.ok) {
    throw new Error(`Enclosures request failed with status ${response.status}`);
  }

  return enclosureListSchema.parse(await response.json());
}

export async function createAnimal(animal: CreateAnimalInput): Promise<void> {
  const response = await fetch(`${apiUrl}/animals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(animal),
  });

  if (!response.ok) {
    throw new Error(`Create animal request failed with status ${response.status}`);
  }
}

export async function createEnclosure(enclosure: CreateEnclosureInput): Promise<void> {
  const response = await fetch(`${apiUrl}/enclosures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enclosure),
  });

  if (!response.ok) {
    throw new Error(`Create enclosure request failed with status ${response.status}`);
  }
}
