import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 300,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        // Base text styling
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        "animate-shiny-text bg-clip-text bg-no-repeat",
        "[background-position:0_0]",
        "[background-size:var(--shiny-width)_100%]",
        "[transition:background-position_1.75s_cubic-bezier(.6,.6,0,1)_infinite]",

        "bg-gradient-to-r from-transparent via-background-inverse to-font-bold to-transparent",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
