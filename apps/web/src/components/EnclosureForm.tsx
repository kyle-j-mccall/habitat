import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEnclosure } from '@/lib/api';

export function EnclosureForm() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const createEnclosureMutation = useMutation({
    mutationFn: createEnclosure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enclosures'] });
      setName('');
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        createEnclosureMutation.mutate({ name });
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="enclosure-name">Name</Label>
        <Input
          id="enclosure-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Grasslands"
          required
        />
      </div>
      <Button type="submit" disabled={!name.trim()}>
        Create enclosure
      </Button>
    </form>
  );
}
