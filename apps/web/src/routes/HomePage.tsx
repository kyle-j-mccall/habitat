import { ApiStatus } from '../components/ApiStatus';

export function HomePage() {
  return (
    <main>
      <h1>Habitat</h1>
      <p>Application is running.</p>
      <ApiStatus />
    </main>
  );
}
