import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type AnimalRow = {
  id: number;
  name: string;
  species: { commonName: string };
  enclosure: { name: string };
};

type Props = {
  animals: AnimalRow[];
};

export function AnimalsList({ animals }: Props) {
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
            {animals.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3}>No animals found.</TableCell>
                </TableRow>
            )}
            {animals.map((animal) => (  
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