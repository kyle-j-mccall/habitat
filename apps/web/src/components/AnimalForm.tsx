import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SpeciesSelect } from './SpeciesSelect';

export function AnimalForm() {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log('Create animal:', { name });
        setName('');
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="animal-name">Name</Label>
        <Input
          id="animal-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Lion"
          required
        />
        <SpeciesSelect
          species={[{ id: 1, commonName: 'Fox' }, { id: 2, commonName: 'Bear' }]}
          value="unknown"
          onChange={(value) => console.log('Selected species:', value)}
        />
      </div>
      <Button type="submit" disabled={!name.trim()}>
        Create animal
      </Button>
    </form>
  );
}