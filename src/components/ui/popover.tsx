
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[100] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      onPointerDownOutside={(e) => {
        // Prevent closing when clicking inside dialog or dialog-related elements
        const target = e.target as HTMLElement;
        if (
          target.closest('[role="dialog"]') ||
          target.closest('[data-state="open"]') ||
          target.closest('.calendar-day') ||
          target.closest('.tooltip-content') ||
          target.closest('.rdp') ||
          target.closest('.rdp-day') ||
          target.closest('.popover-content') ||
          target.closest('.calendar') ||
          // Additional selectors for common modal-related elements
          target.closest('.dialog-content') ||
          target.closest('.dialog-overlay') ||
          target.closest('.alert-dialog-overlay') ||
          target.closest('.alert-dialog-content')
        ) {
          e.preventDefault();
        }
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
