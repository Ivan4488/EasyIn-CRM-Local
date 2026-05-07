import classNames from "classnames";
import { SVGAttributes } from "react";

export const Arrow = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
    >
      <path
        d="M1 6L5 2L9 6"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};
