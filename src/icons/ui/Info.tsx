import classNames from "classnames";
import { SVGAttributes } from "react";

export const Info = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
    >
      <path
        d="M6 12C9.03757 12 11.5 9.53757 11.5 6.5C11.5 3.46243 9.03757 1 6 1C2.96243 1 0.5 3.46243 0.5 6.5C0.5 9.53757 2.96243 12 6 12Z"
        stroke-width="0.9375"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M6 6V9"
        stroke-width="0.9375"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M6 4.5C6.27614 4.5 6.5 4.27614 6.5 4C6.5 3.72386 6.27614 3.5 6 3.5C5.72386 3.5 5.5 3.72386 5.5 4C5.5 4.27614 5.72386 4.5 6 4.5Z"
        fill="#ADB2B2"
      />
    </svg>
  );
};
