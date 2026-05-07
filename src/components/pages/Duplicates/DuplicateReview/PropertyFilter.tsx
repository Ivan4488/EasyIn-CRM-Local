import { ReviewRefresh } from "~/icons/ui/ReviewRefresh";

interface Props {
  count: number;
}

export const PropertyFilter = ({ count }: Props) => {
  return (
    <div className="flex items-center px-[8px] h-[26px] border border-solid border-strong-blue gap-[6px] rounded-[4px] w-fit">
      <ReviewRefresh />

      <span className="text-display-14 font-semibold text-strong-blue">
        {count}
      </span>

      <span className="text-display-14 font-semibold text-strong-blue">
        {count === 1 ? "Review" : "Reviews"}
      </span>
    </div>
  );
};
