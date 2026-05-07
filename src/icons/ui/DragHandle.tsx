import classNames from "classnames";
import { SVGAttributes } from "react";

export const DragHandle = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
    >
      <path
        d="M6.5 9C7.325 9 8 9.675 8 10.5C8 11.325 7.325 12 6.5 12C5.675 12 5 11.325 5 10.5C5 9.675 5.675 9 6.5 9ZM6.5 4.5C7.325 4.5 8 5.175 8 6C8 6.825 7.325 7.5 6.5 7.5C5.675 7.5 5 6.825 5 6C5 5.175 5.675 4.5 6.5 4.5ZM6.5 0C7.325 0 8 0.675 8 1.5C8 2.325 7.325 3 6.5 3C5.675 3 5 2.325 5 1.5C5 0.675 5.675 0 6.5 0ZM2 9C2.825 9 3.5 9.675 3.5 10.5C3.5 11.325 2.825 12 2 12C1.175 12 0.5 11.325 0.5 10.5C0.5 9.675 1.175 9 2 9ZM2 4.5C2.825 4.5 3.5 5.175 3.5 6C3.5 6.825 2.825 7.5 2 7.5C1.175 7.5 0.5 6.825 0.5 6C0.5 5.175 1.175 4.5 2 4.5ZM2 0C2.825 0 3.5 0.675 3.5 1.5C3.5 2.325 2.825 3 2 3C1.175 3 0.5 2.325 0.5 1.5C0.5 0.675 1.175 0 2 0Z"
        fill="#ADB2B2"
      />
    </svg>
  );
};
