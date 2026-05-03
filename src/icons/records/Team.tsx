import classNames from "classnames";
import { SVGAttributes } from "react";

export const Team = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current fill-current")}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.00002 5.97059C5.00002 3.21846 7.24557 1 10 1C12.7545 1 15 3.21846 15 5.97059C15 8.72271 12.7545 10.9412 10 10.9412C7.24557 10.9412 5.00002 8.72271 5.00002 5.97059ZM1.27496 16.3113C3.52204 13.9455 6.59596 12.4706 10 12.4706C13.4041 12.4706 16.478 13.9455 18.7251 16.3113C19.0004 16.6012 19.0766 17.0272 18.9189 17.3945C18.7612 17.7619 18.3998 18 18 18H2.00002C1.60024 18 1.23887 17.7619 1.08114 17.3945C0.923414 17.0272 0.999635 16.6012 1.27496 16.3113Z"
      />
    </svg>
  );
};
