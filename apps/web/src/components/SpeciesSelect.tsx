import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {  useState } from 'react';

type Species = { id: number; commonName: string };
  type Props = {
    species: Species[];
    value: string;                          // controlled from parent (string, since form values are strings)
    onChange: (value: string) => void;
    disabled?: boolean;
  };

export function SpeciesSelect({ species, value, onChange, disabled }: Props) {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(value);

  return (
    <Select
      value={selectedSpecies ?? 'unknown'}
      onValueChange={(newValue: string | null) => {
        setSelectedSpecies(newValue);
        onChange(newValue ?? '');
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a species" />
      </SelectTrigger>
      <SelectContent>
        {species.map((s) => (
          <SelectItem key={s.id} value={s.id.toString()}>
            {s.commonName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 