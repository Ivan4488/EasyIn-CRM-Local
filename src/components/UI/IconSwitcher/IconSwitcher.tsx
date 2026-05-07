import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "~/lib/utils";
import { Company } from "~/icons/records/Company";
import { Contact } from "~/icons/records/Contact";

export const IconSwitcher = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "relative peer inline-flex h-[32px] w-[65px] shrink-0 cursor-pointer items-center rounded-[100px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black-moderate data-[state=unchecked]:bg-black-moderate dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950 dark:data-[state=checked]:bg-black-moderate dark:data-[state=unchecked]:bg-black-moderate border-gray-moderate",
      className
    )}
    {...props}
    ref={ref}
  >
    <Contact className="absolute z-[1] left-[7px] text-text-weak w-[16px] h-[16px]" />
    <Company className="absolute right-[7px] z-[1] text-text-weak w-[16px] h-[16px]" />

    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[32px] w-[32px] rounded-full bg-gray-moderate shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[32px] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
IconSwitcher.displayName = SwitchPrimitives.Root.displayName;

export { IconSwitcher as Switch };
