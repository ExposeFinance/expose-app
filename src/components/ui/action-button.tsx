import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import your `cn` utility (e.g., clsx or classnames)

type ActionButtonProps = {
  label: string;
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  id,
  onClick,
  disabled = false,
}) => (
  <Button
    onClick={onClick}
    id={id}
    disabled={disabled}
    variant="default"
    className={cn(
      "w-full active:opacity-90 py-4 text-sm sm:text-base transition-all duration-200 transform active:scale-95",
      {
        "opacity-50 cursor-not-allowed": disabled,
      }
    )}
  >
    {label}
  </Button>
);
