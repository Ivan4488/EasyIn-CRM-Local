import React from "react";
import { Cross } from "~/icons/ui/Cross";

type RoundCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
};

export const RoundClose = ({ title, ...props }: RoundCloseProps) => {
  return (
    <button
      {...props}
      className="flex flex-row text-text-weak items-center"
    >
      <div className="flex flex-row justify-end relative gap-[6px] text-text-weak bg-gray-moderate px-[10px] py-[7px] group-hover:border-hover-2 border border-gray-moderate rounded-[6px] font-semibold text-display-12 ">
        <p className="text-display-12">{title || "Close"}</p>
        <Cross />
      </div>
    </button>
  );
};
