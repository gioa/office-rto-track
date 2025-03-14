
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Entry } from "@/lib/types";
import { formatEntryType } from "./utils";
import { useEntries } from "@/hooks/entries";

interface DeleteEntryButtonProps {
  entry: Entry;
  onOpenChange?: (open: boolean) => void;
}

const DeleteEntryButton = ({ entry, onOpenChange }: DeleteEntryButtonProps) => {
  const { deleteEntry } = useEntries();
  
  const handleDelete = async () => {
    await deleteEntry.mutateAsync(entry.id);
  };
  
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3 mr-1" />
          Delete Entry
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent 
        onClick={(e) => e.stopPropagation()}
        className="alert-dialog-content"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {formatEntryType(entry.type).toLowerCase()} entry? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEntryButton;
