import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative aspect-square size-4.5 shrink-0 rounded-full border-2 border-slate-300 bg-white shadow-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-blue-400/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-slate-600 dark:bg-slate-950 dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex h-full w-full items-center justify-center"
      >
        <span className="size-2 rounded-full bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
