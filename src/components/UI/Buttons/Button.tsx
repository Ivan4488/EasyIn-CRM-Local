import { type FC } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "action";
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({ children, className, Icon, variant = "primary", isLoading, ...props }) => {
  const classes = {
    danger:
      "flex flex-row justify-center items-center gap-[10px] bg-strong-error hover:bg-hover-pink text-b1-black rounded-[12px] px-[16px] py-[12px] text-display-15 disabled:text-b1-black disabled:pointer-events-none whitespace-nowrap w-fit disabled:bg-hover-pink/[50]",
    primary: 
      "flex flex-row justify-center items-center gap-[10px] bg-strong-green hover:bg-hover-green hover:border-strong-green text-b1-black rounded-[12px] px-[16px] py-[12px] text-display-15 disabled:text-b1-black disabled:pointer-events-none whitespace-nowrap w-fit disabled:bg-disabled-green",
    secondary:
      "flex flex-row justify-center items-center gap-[10px] bg-b1-black hover:bg-hover-1 hover:border-hover-2 text-text-weak rounded-[12px] px-[16px] py-[12px] text-display-15 disabled:text-text-disabled disabled:pointer-events-none border border-solid border-gray-moderate whitespace-nowrap w-fit",
    action:
      "flex flex-row justify-center items-center gap-[10px] bg-b1-black hover:bg-hover-1 hover:border-hover-2 text-text-weak rounded-[12px] px-[16px] py-[12px] text-display-15 disabled:text-text-disabled disabled:pointer-events-none border border-solid border-gray-moderate whitespace-nowrap w-fit h-[24px] !rounded text-display-12 px-[8px] !py-[4px]",
  };


  return (
      <button {...props} className={`${classes[variant]} ${className || ""}`}>
        {Icon && !isLoading && <Icon color="white" />}
        {children}
      </button>
  );
};
