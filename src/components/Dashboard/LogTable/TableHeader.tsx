
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LogTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Day</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Office Location</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LogTableHeader;
