import classNames from "classnames";
import { CircleCheck } from "~/icons/ui/CircleCheck";
import { CircleCross } from "~/icons/ui/CircleCross";

interface VerifiedStatusProps {
  status: "verified" | "not_started" | "failed";
}

export const VerifiedStatus = ({ status }: VerifiedStatusProps) => {
  const color = {
    verified: "text-strong-green",
    not_started: "text-strong-yellow",
    failed: "text-text-weak",
    pending: "text-strong-yellow",
  };

  const icon = {
    verified: <CircleCheck className="w-[10px] h-[10px]" />,
    not_started: <CircleCross className="w-[10px] h-[10px] fill-strong-yellow" />,
    failed: <CircleCross className="w-[10px] h-[10px] fill-text-weak" />,
    pending: <CircleCross className="w-[10px] h-[10px] fill-strong-yellow" />,
  };

  console.log(status);

  return (
    <div
      className={classNames(
        "font-[500] text-display-12 flex items-center gap-[6px]",
        color[status]
      )}
    >
      <div className="w-[10px] h-[10px]">{icon[status]}</div>
    </div>
  );
};
