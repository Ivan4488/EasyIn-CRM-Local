import classNames from "classnames";
import { SVGAttributes } from "react";

export const Calendar = (props: SVGAttributes<SVGElement>) => {
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
      <g clip-path="url(#clip0_1563_5151)">
        <path
          d="M5 0V1.66667"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
        <path
          d="M15 0V1.66667"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
        <path
          d="M0.833374 5.83325H19.1667"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
        <path
          d="M17.5 2.5H2.50004C1.57957 2.5 0.833374 3.24619 0.833374 4.16667V15.8333C0.833374 16.7538 1.57957 17.5 2.50004 17.5H17.5C18.4205 17.5 19.1667 16.7538 19.1667 15.8333V4.16667C19.1667 3.24619 18.4205 2.5 17.5 2.5Z"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0_1563_5151">
          <rect
            width="20"
            height="20"
            transform="translate(0 -0.833252)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
