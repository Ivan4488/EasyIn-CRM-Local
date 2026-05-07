import classNames from "classnames";

export const HiddenLine = ({ className }: { className?: string }) => {
  return (
    <div className={classNames("h-[1px] absolute z-[10] top-[20px] left-[50px] w-[162px] bg-gray-moderate", className)}></div>
  );
};