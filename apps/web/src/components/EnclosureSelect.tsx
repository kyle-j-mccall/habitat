import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listEnclosures } from '@/lib/api';

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function EnclosureSelect({ value, onChange, disabled }: Props) {
  const enclosuresQuery = useQuery({
    queryKey: ['enclosures'],
    queryFn: listEnclosures,
  });

  if (enclosuresQuery.isError) {
    return <p className="text-sm text-destructive">Could not load enclosures.</p>;
  }

  const isEmpty = !enclosuresQuery.isPending && enclosuresQuery.data?.length === 0;

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? '')}
      disabled={disabled || enclosuresQuery.isPending || isEmpty}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            enclosuresQuery.isPending
              ? 'Loading enclosures…'
              : isEmpty
                ? 'Create an enclosure first'
                : 'Select an enclosure'
          }
        />
      </SelectTrigger>
      <SelectContent>
        {enclosuresQuery.data?.map((enclosure) => (
          <SelectItem key={enclosure.id} value={enclosure.id.toString()}>
            {enclosure.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
