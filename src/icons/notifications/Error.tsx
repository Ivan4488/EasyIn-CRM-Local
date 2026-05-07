import classNames from "classnames";
import { SVGAttributes } from "react";

export const Error = (props: SVGAttributes<SVGElement>) => {
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
        d="M9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25Z"
        stroke="#FB759D"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M9 5.25V9.75"
        stroke="#FB759D"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M9 13.5C9.41421 13.5 9.75 13.1642 9.75 12.75C9.75 12.3358 9.41421 12 9 12C8.58579 12 8.25 12.3358 8.25 12.75C8.25 13.1642 8.58579 13.5 9 13.5Z"
        fill="#FB759D"
      />
    </svg>
  );
};
