import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "~/lib/utils";

export const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "relative peer inline-flex h-[22px] w-[39px] shrink-0 cursor-pointer items-center rounded-[100px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-strong-green data-[state=unchecked]:bg-gray-moderate",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[16px] w-[16px] rounded-full bg-black-moderate shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-[3px]"
      )}
    />
  </SwitchPrimitives.Root>
));
Toggle.displayName = SwitchPrimitives.Root.displayName;
