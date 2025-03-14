import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import EntryForm from "./EntryForm";
import { cn } from "@/lib/utils";
import { useEntries } from "@/hooks/entries";

interface EntryFormDialogProps {
  date?: Date;
  buttonVariant?: "default" | "secondary" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const EntryFormDialog = ({
  date,
  buttonVariant = "default",
  buttonSize = "default",
  className,
  children,
  fullWidth = true,
}: EntryFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { addEntry } = useEntries();

  const handleSubmitComplete = (keepOpen: boolean) => {
    if (!keepOpen) {
      setOpen(false);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (children) {
      e.stopPropagation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleTriggerClick}>
        {children ? (
          children
        ) : (
          <Button 
            variant={buttonVariant} 
            size={buttonSize}
            className={cn(
              "mt-6",
              className, 
              fullWidth ? "w-full" : ""
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <EntryForm 
          compact={true} 
          initialDate={date} 
          onSubmitComplete={handleSubmitComplete}
          addEntry={addEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EntryFormDialog;
