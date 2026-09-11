import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnclosureForm } from '@/components/EnclosureForm';
import { AnimalForm } from '@/components/AnimalForm';
import { AnimalsList } from '@/components/AnimalsList';

export function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">Habitat Dashboard</h1>
        <p className="text-muted-foreground">
          Create enclosures and animals, then browse the collection.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New enclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <EnclosureForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New animal</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimalForm />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Animals</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimalsList
          />
        </CardContent>
      </Card>
    </main>
  );
}
