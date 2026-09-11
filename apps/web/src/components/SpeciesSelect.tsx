import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listSpecies } from '@/lib/api';

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SpeciesSelect({ value, onChange, disabled }: Props) {
  const speciesQuery = useQuery({
    queryKey: ['species'],
    queryFn: listSpecies,
  });

  if (speciesQuery.isError) {
    return <p className="text-sm text-destructive">Could not load species.</p>;
  }

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? '')}
      disabled={disabled || speciesQuery.isPending}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={speciesQuery.isPending ? 'Loading species…' : 'Select a species'}
        />
      </SelectTrigger>
      <SelectContent>
        {speciesQuery.data?.map((species) => (
          <SelectItem key={species.id} value={species.id.toString()}>
            {species.commonName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
