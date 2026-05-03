import classNames from "classnames";
import { Download } from "~/icons/ui/Download";

interface Props {
  index: number;
}

export const Transaction = ({ index }: Props) => {
  const isWithBackground = index % 2 === 0;

  return (
    <div
      className={classNames(
        "flex flex-row items-center text-text-weak text-display-16 rounded-[8px] px-[16px] py-[8px] justify-between gap-[12px]",
        isWithBackground ? "bg-hover-1" : ""
      )}
    >
      <div>Feb 1, 2019</div>
      <div>Pending</div>
      <div>+ $100.00</div>
      <div>
        <Download />
      </div>
    </div>
  );
};
