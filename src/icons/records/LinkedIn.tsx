import classNames from "classnames";
import { SVGAttributes } from "react";

export const LinkedIn = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "fill-current")}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="LinkedIn">
        <g id="linked_in">
          <path
            d="M4.68744 3.8508C4.68744 4.65184 3.99621 5.30122 3.14353 5.30122C2.29084 5.30122 1.59961 4.65184 1.59961 3.8508C1.59961 3.04976 2.29084 2.40039 3.14353 2.40039C3.99621 2.40039 4.68744 3.04976 4.68744 3.8508Z"
          />
          <path
            d="M1.81074 6.36733H4.44992V14.4004H1.81074V6.36733Z"
          />
          <path
            d="M8.69899 6.36733H6.05982V14.4004H8.69899C8.69899 14.4004 8.69899 11.8715 8.69899 10.2903C8.69899 9.34121 9.02161 8.38799 10.3089 8.38799C11.7637 8.38799 11.7549 9.62999 11.7481 10.5922C11.7393 11.8499 11.7604 13.1334 11.7604 14.4004H14.3996V10.1607C14.3773 7.45357 13.675 6.20618 11.3646 6.20618C9.99248 6.20618 9.14198 6.83187 8.69899 7.39796V6.36733Z"
          />
        </g>
      </g>
    </svg>
  );
};
