import classNames from "classnames";
import { SVGAttributes } from "react";

export const ImageIcon = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
    >
      <path
        d="M14.2 9.16671L18 13.3334H6L9 10.0834L11.1 12.3334L14 9.16671H14.2ZM8.5 9.16671C9.3 9.16671 10 8.58337 10 7.91671C10 7.25004 9.3 6.66671 8.5 6.66671C7.7 6.66671 7 7.25004 7 7.91671C7 8.58337 7.7 9.16671 8.5 9.16671ZM22 5.00004V15C22 15.9167 21.1 16.6667 20 16.6667H4C2.9 16.6667 2 15.9167 2 15V5.00004C2 4.08337 2.9 3.33337 4 3.33337H20C21.1 3.33337 22 4.08337 22 5.00004ZM20 7.33337V5.00004H4V15H20V7.33337Z"
        fill="#ADB2B2"
      />
    </svg>
  );
};
