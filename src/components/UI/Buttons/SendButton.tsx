import { type FC } from "react";
import { Send } from "~/icons/ui/Send"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary";
  children: React.ReactNode;
}

export const SendButton: FC<ButtonProps> = ({ children, className, variant = "primary", ...props }) => {
  const classes = {
    primary: 
      "flex h-[32px] flex-row justify-center items-center gap-[10px] border border-solid border-transparent bg-gray-moderate hover:bg-text-weak/35 text-b1-black rounded-[24px] px-[14px] py-[6px] text-display-15 disabled:text-text-weak/50 whitespace-nowrap w-fit disabled:bg-transparent",
  };

  return (
      <button {...props} className={`${className || ""} ${classes[variant]} group text-text-moderate`}>
        {children}
         <Send className="text-hover-2 group-disabled:text-text-weak/50"/>
      </button>
  );
};
