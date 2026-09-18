import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEnclosure, listEnclosures } from '@/lib/api';
import { Button } from './ui/button';

export function EnclosuresList() {
  const queryClient = useQueryClient();
  const enclosuresQuery = useQuery({
    queryKey: ['enclosures'],
    queryFn: listEnclosures,
  });

  const deleteEnclosureMutation = useMutation({
    mutationFn: deleteEnclosure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enclosures'] });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Animals</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enclosuresQuery.data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={3}>No enclosures found.</TableCell>
          </TableRow>
        )}
        {enclosuresQuery.data?.map((enclosure) => (
          <TableRow key={enclosure.id}>
            <TableCell>{enclosure.name}</TableCell>
            <TableCell>
              {enclosure.animals.length === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                enclosure.animals.map((a) => a.name).join(', ')
              )}
            </TableCell>

            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteEnclosureMutation.mutate(enclosure.id)}
                disabled={deleteEnclosureMutation.isPending}
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
