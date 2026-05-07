import classNames from "classnames";
import { SVGAttributes } from "react";

export const Sort = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M5.83333 3.33301V16.6663M5.83333 16.6663L2.5 13.333M5.83333 16.6663L9.16667 13.333M14.1667 16.6663V3.33301M14.1667 3.33301L10.8333 6.66634M14.1667 3.33301L17.5 6.66634"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
