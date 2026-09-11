import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useQuery } from '@tanstack/react-query';
import { fetchAnimals } from '@/lib/api';



export function AnimalsList() {
  const animalsQuery = useQuery({
    queryKey: ['animals'],
    queryFn: fetchAnimals,
  });


  return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Enclosure</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {animalsQuery.data?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3}>No animals found.</TableCell>
                </TableRow>
            )}
            {animalsQuery.data?.map((animal) => (
                <TableRow key={animal.id}>
                    <TableCell>{animal.name}</TableCell>
                    <TableCell>{animal.species.commonName}</TableCell>
                    <TableCell>{animal.enclosure.name}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  );
}