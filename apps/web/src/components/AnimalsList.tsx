import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAnimal, fetchAnimals } from '@/lib/api';
import { Button } from './ui/button';

export function AnimalsList() {
  const queryClient = useQueryClient();
  const animalsQuery = useQuery({
    queryKey: ['animals'],
    queryFn: fetchAnimals,
  });

  const deleteAnimalMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Species</TableHead>
          <TableHead>Enclosure</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animalsQuery.data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>No animals found.</TableCell>
          </TableRow>
        )}
        {animalsQuery.data?.map((animal) => (
          <TableRow key={animal.id}>
            <TableCell>{animal.name}</TableCell>
            <TableCell>{animal.species.commonName}</TableCell>
            <TableCell>{animal.enclosure.name}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAnimalMutation.mutate(animal.id)}
                disabled={deleteAnimalMutation.isPending}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
