import classNames from "classnames";
import { SVGAttributes } from "react";

export const AlignLeft = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M2.5 15H7.5V13.3333H2.5V15ZM2.5 9.16667V10.8333H12.5V9.16667H2.5ZM2.5 5V6.66667H17.5V5H2.5Z"
      />
    </svg>
  );
};
