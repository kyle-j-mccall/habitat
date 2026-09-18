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
import { Button, buttonVariants } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

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
      queryClient.invalidateQueries({ queryKey: ['animals'] });
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
        {enclosuresQuery.data?.map((enclosure) => {
          const animalCount = enclosure.animals.length;
          return (
            <TableRow key={enclosure.id}>
              <TableCell>{enclosure.name}</TableCell>
              <TableCell>
                {animalCount === 0 ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  enclosure.animals.map((a) => a.name).join(', ')
                )}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteEnclosureMutation.isPending}
                      >
                        Delete
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete “{enclosure.name}”?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {animalCount === 0
                          ? 'This action cannot be undone.'
                          : `${animalCount} ${animalCount === 1 ? 'animal' : 'animals'} will be marked as unassigned. This action cannot be undone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: 'destructive' })}
                        onClick={() =>
                          deleteEnclosureMutation.mutate(enclosure.id)
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
