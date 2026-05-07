import classNames from "classnames";
import { SVGAttributes } from "react";

export const MessageSourceWithPlus = (props: SVGAttributes<SVGElement>) => {
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
      <g clip-path="url(#clip0_35_1129)">
        <path
          d="M17 6.66667H2M2 5.73333L2 12.2667C2 13.5735 2 14.2268 2.24524 14.726C2.46095 15.165 2.80516 15.522 3.22852 15.7457C3.70982 16 4.33988 16 5.6 16H13.4C14.6601 16 15.2902 16 15.7715 15.7457C16.1948 15.522 16.5391 15.165 16.7548 14.726C17 14.2269 17 13.5735 17 12.2667V5.73333C17 4.42655 17 3.77315 16.7548 3.27402C16.5391 2.83498 16.1948 2.47802 15.7715 2.25432C15.2902 2 14.6601 2 13.4 2L5.6 2C4.33988 2 3.70982 2 3.22852 2.25432C2.80516 2.47802 2.46095 2.83498 2.24524 3.27402C2 3.77315 2 4.42654 2 5.73333Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15.5" cy="13.5" r="4.5" fill="#252F2F" />
        <path
          d="M15.5 15.75V11.25M13.25 13.5H17.75"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_35_1129">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
