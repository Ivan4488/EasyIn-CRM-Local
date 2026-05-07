import classNames from "classnames";
import { SVGAttributes } from "react";

export const BlueDot = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
    >
      <circle cx="4" cy="4" r="4" fill="url(#paint_blue_dot)" />
      <defs>
        <linearGradient
          id="paint_blue_dot"
          x1="4" y1="0"
          x2="4" y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00C4FF" />
          <stop offset="1" stopColor="#2285FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
