import classNames from "classnames";
import { SVGAttributes } from "react";

export const Success = (props: SVGAttributes<SVGElement>) => {
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
        d="M4.5 9L7.5 12L13.5 6"
        stroke="#39D0B5"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25Z"
        stroke="#39D0B5"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
    </svg>
  );
};
