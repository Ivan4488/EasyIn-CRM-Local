import classNames from "classnames";
import { SVGAttributes } from "react";

export const Check = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M15 4.5L6.75 12.75L3 9"
        stroke-width="1.6666"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
