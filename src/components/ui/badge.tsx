import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-red-100 text-red-700 [a&]:hover:bg-red-100/80 focus-visible:ring-red-500/20 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 dark:[a&]:hover:bg-red-900/50",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        green:
          "bg-green-100 text-green-700 [a&]:hover:bg-green-100/80 focus-visible:ring-green-500/20 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 dark:[a&]:hover:bg-green-900/50",
        blue: "bg-blue-100 text-blue-700 [a&]:hover:bg-blue-100/80 focus-visible:ring-blue-500/20 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 dark:[a&]:hover:bg-blue-900/50",
        orange:
          "bg-orange-100 text-orange-700 [a&]:hover:bg-orange-100/80 focus-visible:ring-orange-500/20 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700 dark:[a&]:hover:bg-orange-900/50",
        purple:
          "bg-[#EEF2FF] text-[#4F46E5] [a&]:hover:bg-purple-100/80 focus-visible:ring-purple-500/20 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700 dark:[a&]:hover:bg-purple-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
