
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  onOpenChange?: (open: boolean) => void;
}

const EntryFormDialog = ({
  date,
  buttonVariant = "default",
  buttonSize = "default",
  className,
  children,
  fullWidth = true,
  onOpenChange,
}: EntryFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { addEntry } = useEntries();

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    // Call the parent's onOpenChange handler if provided
    if (onOpenChange) {
      onOpenChange(openState);
    }
  };

  const handleSubmitComplete = (keepOpen: boolean) => {
    if (!keepOpen) {
      handleOpenChange(false);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent parent elements from capturing the click
    e.stopPropagation();
    // Set the dialog to open
    handleOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      <DialogContent 
        className="sm:max-w-[425px] dialog-content" 
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking inside calendar elements
          const target = e.target as HTMLElement;
          if (
            target.closest('.calendar') ||
            target.closest('.rdp') ||
            target.closest('.rdp-day') ||
            target.closest('[role="dialog"]') ||
            target.closest('.popover-content') ||
            target.closest('.tooltip-content')
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogDescription>
            Record a new office visit, sick day, PTO, or company event
          </DialogDescription>
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
