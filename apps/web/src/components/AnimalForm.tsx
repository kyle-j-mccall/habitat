import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SpeciesSelect } from './SpeciesSelect';
import { EnclosureSelect } from './EnclosureSelect';
import { createAnimal } from '@/lib/api';

export function AnimalForm() {
  const [name, setName] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [enclosureId, setEnclosureId] = useState('');
  const queryClient = useQueryClient();

  const createAnimalMutation = useMutation({
    mutationFn: createAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      setName('');
      setSpeciesId('');
      setEnclosureId('');
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        createAnimalMutation.mutate({
          name,
          speciesId: Number(speciesId),
          enclosureId: Number(enclosureId),
        });
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="animal-species">Species</Label>
        <SpeciesSelect value={speciesId} onChange={setSpeciesId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="animal-enclosure">Enclosure</Label>
        <EnclosureSelect value={enclosureId} onChange={setEnclosureId} />
      </div>
      <Button
        type="submit"
        disabled={
          !name.trim() ||
          !speciesId ||
          !enclosureId ||
          createAnimalMutation.isPending
        }
      >
        {createAnimalMutation.isPending ? 'Creating…' : 'Create animal'}
      </Button>
      {createAnimalMutation.isError && (
        <p className="text-sm text-destructive">
          {createAnimalMutation.error.message}
        </p>
      )}
    </form>
  );
}
