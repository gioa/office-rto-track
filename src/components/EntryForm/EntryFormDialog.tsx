
import React from "react";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button 
            variant={buttonVariant} 
            size={buttonSize}
            className={cn(className, fullWidth ? "w-full" : "")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <EntryForm compact={true} initialDate={date} />
      </DialogContent>
    </Dialog>
  );
};

export default EntryFormDialog;
