import classNames from "classnames";
import { SVGAttributes } from "react";

export const DomainWarning = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11.9999 21.937C17.4879 21.937 21.9368 17.4881 21.9368 12C21.9368 6.51203 17.4879 2.06311 11.9999 2.06311C6.5119 2.06311 2.06299 6.51203 2.06299 12C2.06299 17.4881 6.5119 21.937 11.9999 21.937Z"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="square"
      />
      <path
        d="M12 7.48328V12.9034"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M12 18.0225C12.6652 18.0225 13.2045 17.4832 13.2045 16.818C13.2045 16.1528 12.6652 15.6135 12 15.6135C11.3348 15.6135 10.7955 16.1528 10.7955 16.818C10.7955 17.4832 11.3348 18.0225 12 18.0225Z"
        fill="currentColor"
      />
    </svg>
  );
};
