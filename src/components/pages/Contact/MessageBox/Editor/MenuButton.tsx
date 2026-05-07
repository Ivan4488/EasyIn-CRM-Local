import classNames from "classnames";
import { forwardRef } from "react";

interface MenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ Icon, isActive, isDisabled, ...props }: MenuButtonProps, ref) => {
    return (
      <button
        disabled={isDisabled}
        ref={ref}
        {...props}
        className={"w-[28px] h-[28px] rounded-[4px] flex items-center justify-center group hover:bg-hover-1 disabled:text-text-disabled disabled:opacity-30"}
      >
        <Icon
          className={classNames(isActive && !isDisabled ? "text-strong-green" : "text-text-weak")}
        />
      </button>
    );
  }
);

MenuButton.displayName = "EditorMenuButton";
