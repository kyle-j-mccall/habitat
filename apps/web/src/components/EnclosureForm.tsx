import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EnclosureForm() {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log('Create enclosure:', { name });
        setName('');
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
