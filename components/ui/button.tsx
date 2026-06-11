import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "icon";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "border border-white/10 bg-white/8 text-foreground hover:bg-white/12",
    variant === "ghost" && "text-muted-foreground hover:bg-white/8 hover:text-foreground",
    variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    size === "sm" && "h-9 px-3",
    size === "md" && "h-10 px-4",
    size === "icon" && "h-10 w-10",
    className
  );

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className)
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
