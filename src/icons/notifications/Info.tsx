import classNames from "classnames";
import { SVGAttributes } from "react";

export const Info = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group">
        <path
          id="Vector"
          d="M9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25Z"
          stroke="white"
          stroke-width="1.25"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
        <path
          id="Vector_2"
          d="M9 8.25V12.75"
          stroke="white"
          stroke-width="1.25"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
        <path
          id="Vector_3"
          d="M9 6C9.41421 6 9.75 5.66421 9.75 5.25C9.75 4.83579 9.41421 4.5 9 4.5C8.58579 4.5 8.25 4.83579 8.25 5.25C8.25 5.66421 8.58579 6 9 6Z"
          fill="white"
        />
      </g>
    </svg>
  );
};
