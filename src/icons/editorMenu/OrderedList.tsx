import classNames from "classnames";
import { SVGAttributes } from "react";

export const OrderedList = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="12"
      viewBox="0 0 16 12"
    >
      <path
        className="fill-current"
        d="M0.083313 9.33341H1.74998V9.75008H0.916646V10.5834H1.74998V11.0001H0.083313V11.8334H2.58331V8.50008H0.083313V9.33341ZM0.916646 3.50008H1.74998V0.166748H0.083313V1.00008H0.916646V3.50008ZM0.083313 5.16675H1.58331L0.083313 6.91675V7.66675H2.58331V6.83341H1.08331L2.58331 5.08341V4.33341H0.083313V5.16675ZM4.24998 1.00008V2.66675H15.9166V1.00008H4.24998ZM4.24998 11.0001H15.9166V9.33341H4.24998V11.0001ZM4.24998 6.83341H15.9166V5.16675H4.24998V6.83341Z"
      />
    </svg>
  );
};
