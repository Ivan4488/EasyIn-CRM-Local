import classNames from "classnames";
import { SVGAttributes } from "react";

export const PlusThin = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="73"
      viewBox="0 0 72 73"
      fill="none"
    >
      <path
        d="M36 15.5V57.5M15 36.5H57"
        stroke="#ADB2B2"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
