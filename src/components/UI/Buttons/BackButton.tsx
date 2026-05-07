import React from "react";
import { Arrow } from "~/icons/ui/Arrow";

type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const BackButton = ({ ...props }: BackButtonProps) => {
  return (
    <button {...props} className="flex flex-row text-text-weak items-center ">
      <Arrow className="rotate-180 mr-[10px]" />
      <p className="text-display-12 font-bold tracking-[1px] leading-[22px] border-b border-hover-2 border-opacity-0 group-hover:border-opacity-100">CLOSE</p>
    </button>
  );
};
