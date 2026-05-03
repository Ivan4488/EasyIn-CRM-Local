import classNames from "classnames";
import { SVGAttributes } from "react";

export const CompanyDuplicate = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="23"
      height="20"
      {...props}
      className={classNames(props.className)}
      viewBox="0 0 23 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Strong building — solid strong-green stroke */}
      <path
        d="M14.41 18V6.59282C14.41 5.68525 14.41 5.23146 14.2193 4.88482C14.0515 4.5799 13.7838 4.33199 13.4545 4.17663C13.0801 4 12.5901 4 11.61 4H8.39C7.40991 4 6.91986 4 6.54552 4.17663C6.21623 4.33199 5.94852 4.5799 5.78074 4.88482C5.59 5.23146 5.59 5.68525 5.59 6.59282V18M17 18H3"
        stroke="#39D0B5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4V2"
        stroke="#39D0B5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Dim building — offset right, reduced opacity */}
      <g opacity="0.38">
        <path
          d="M19.41 18V6.59282C19.41 5.68525 19.41 5.23146 19.2193 4.88482C19.0515 4.5799 18.7838 4.33199 18.4545 4.17663C18.0801 4 17.5901 4 16.61 4H13.39C12.4099 4 11.9199 4 11.5455 4.17663M22 18H8"
          stroke="#39D0B5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 4V2"
          stroke="#39D0B5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
