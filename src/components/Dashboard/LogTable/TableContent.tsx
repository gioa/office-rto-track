
import { Entry } from "@/lib/types";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import TableRowItem from "./TableRowItem";

interface TableContentProps {
  entries: Entry[];
}

const TableContent = ({ entries }: TableContentProps) => {
  return (
    <TableBody>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <TableRowItem key={entry.id} entry={entry} />
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-4">No entries found</TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default TableContent;
