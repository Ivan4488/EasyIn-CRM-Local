import classNames from "classnames";
import { SVGAttributes } from "react";

export const Cross = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L7 7L2 2"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M2 12L7 7L12 12"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};
