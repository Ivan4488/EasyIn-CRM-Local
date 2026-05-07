import classNames from "classnames";
import { SVGAttributes } from "react";

export const Dots = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="4"
      viewBox="0 0 14 4"
      fill="none"
    >
      <path
        d="M6.25 2C6.25 2.41421 6.58579 2.75 7 2.75C7.41421 2.75 7.75 2.41421 7.75 2C7.75 1.58579 7.41421 1.25 7 1.25C6.58579 1.25 6.25 1.58579 6.25 2Z"
      />
      <path
        d="M11.5 2C11.5 2.41421 11.8358 2.75 12.25 2.75C12.6642 2.75 13 2.41421 13 2C13 1.58579 12.6642 1.25 12.25 1.25C11.8358 1.25 11.5 1.58579 11.5 2Z"
      />
      <path
        d="M1 2C1 2.41421 1.33579 2.75 1.75 2.75C2.16421 2.75 2.5 2.41421 2.5 2C2.5 1.58579 2.16421 1.25 1.75 1.25C1.33579 1.25 1 1.58579 1 2Z"
      />
      <path
        d="M6.25 2C6.25 2.41421 6.58579 2.75 7 2.75C7.41421 2.75 7.75 2.41421 7.75 2C7.75 1.58579 7.41421 1.25 7 1.25C6.58579 1.25 6.25 1.58579 6.25 2Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.5 2C11.5 2.41421 11.8358 2.75 12.25 2.75C12.6642 2.75 13 2.41421 13 2C13 1.58579 12.6642 1.25 12.25 1.25C11.8358 1.25 11.5 1.58579 11.5 2Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 2C1 2.41421 1.33579 2.75 1.75 2.75C2.16421 2.75 2.5 2.41421 2.5 2C2.5 1.58579 2.16421 1.25 1.75 1.25C1.33579 1.25 1 1.58579 1 2Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
