
import { format } from "date-fns";
import { Entry } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatEntryType, getOfficeLocation } from "./entryFormatters";
import { currentUser } from "@/lib/data/currentUser";

interface TableRowItemProps {
  entry: Entry;
}

const TableRowItem = ({ entry }: TableRowItemProps) => {
  return (
    <TableRow key={entry.id}>
      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
      <TableCell>{format(new Date(entry.date), 'EEEE')}</TableCell>
      <TableCell>{entry.userId === currentUser.id ? currentUser.email : entry.userId}</TableCell>
      <TableCell>{getOfficeLocation(entry)}</TableCell>
      <TableCell>{formatEntryType(entry.type)}</TableCell>
      <TableCell className="max-w-[200px] truncate">{entry.note || '-'}</TableCell>
    </TableRow>
  );
};

export default TableRowItem;
