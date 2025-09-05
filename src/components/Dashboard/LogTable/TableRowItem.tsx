
import { format } from "date-fns";
import { Entry } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatEntryType, getOfficeLocation } from "./entryFormatters";
import { currentUser } from "@/lib/data/currentUser";

interface TableRowItemProps {
  entry: Entry;
}

const TableRowItem = ({ entry }: TableRowItemProps) => {
  // Use the date directly since it's already timezone-corrected in the data layer
  const entryDate = entry.date;
  
  return (
    <TableRow key={entry.id}>
      <TableCell>{format(entryDate, 'MMM d, yyyy')}</TableCell>
      <TableCell>{format(entryDate, 'EEEE')}</TableCell>
      <TableCell>{entry.userId === currentUser.id ? 'You' : entry.userId}</TableCell>
      <TableCell>{getOfficeLocation(entry)}</TableCell>
      <TableCell>{formatEntryType(entry.type)}</TableCell>
      <TableCell className="max-w-[200px] truncate">{entry.note || '-'}</TableCell>
    </TableRow>
  );
};

export default TableRowItem;
