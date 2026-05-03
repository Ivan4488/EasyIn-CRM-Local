import classNames from "classnames";
import { SVGAttributes } from "react";

export const Minus = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="2"
      viewBox="0 0 14 2"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1C14 1.55228 13.5523 2 13 2H1C0.447715 2 0 1.55228 0 1Z"
      />
    </svg>
  );
};
