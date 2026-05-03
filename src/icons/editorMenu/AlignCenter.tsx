import classNames from "classnames";
import { SVGAttributes } from "react";

export const AlignCenter = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path
        d="M7.5 15H12.5V13.3333H7.5V15ZM5 9.16667V10.8333H15V9.16667H5ZM2.5 5V6.66667H17.5V5H2.5Z"
      />
    </svg>
  );
};
