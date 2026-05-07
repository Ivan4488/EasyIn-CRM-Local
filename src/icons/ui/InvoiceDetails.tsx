import classNames from "classnames";
import { SVGAttributes } from "react";

export const InvoiceDetails = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className, "stroke-current")}
      xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
  <g clip-path="url(#clip0_978_3080)">
    <path d="M29 29.5C29 30.0304 28.7893 30.5391 28.4142 30.9142C28.0391 31.2893 27.5304 31.5 27 31.5H5C4.46957 31.5 3.96086 31.2893 3.58579 30.9142C3.21071 30.5391 3 30.0304 3 29.5V3.5C3 2.96957 3.21071 2.46086 3.58579 2.08579C3.96086 1.71071 4.46957 1.5 5 1.5H19.172C19.7021 1.50011 20.2104 1.71064 20.5853 2.08533L28.4147 9.91467C28.7894 10.2896 28.9999 10.7979 29 11.328V29.5Z" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29 11.5H21C20.4696 11.5 19.9609 11.2893 19.5858 10.9142C19.2107 10.5391 19 10.0304 19 9.5V1.5" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.26667 15.9587C8.55542 16.338 8.93136 16.6421 9.3626 16.8452C9.79385 17.0482 10.2677 17.1444 10.744 17.1254C12.2627 17.1254 13.4947 16.2014 13.4947 15.0627C13.4947 13.9241 12.2667 13.0014 10.7493 13.0014C9.232 13.0014 8 12.0774 8 10.9374C8 9.79741 9.232 8.87474 10.7493 8.87474C11.2257 8.85544 11.6996 8.95142 12.1309 9.15454C12.5623 9.35765 12.9381 9.6619 13.2267 10.0414" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.7495 17.1252V18.4999" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.7495 7.5V8.87467" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 20.5H24" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 26.5H24" stroke="#ADB2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_978_3080">
      <rect width="32" height="32" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
  </defs>
</svg>
  );
};
