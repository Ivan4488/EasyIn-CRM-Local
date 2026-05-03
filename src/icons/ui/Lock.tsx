import classNames from "classnames";
import { SVGAttributes } from "react";

export const Lock = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1331 7.33333V6.66667C14.1331 4.36548 12.2677 2.5 9.96647 2.5C7.66528 2.5 5.7998 4.36548 5.7998 6.66667V7.33333"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="3"
        y="8"
        width="14"
        height="9"
        rx="1"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 11.5V13.1667"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
