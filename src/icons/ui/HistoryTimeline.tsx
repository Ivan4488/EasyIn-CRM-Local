import classNames from "classnames";
import { SVGAttributes } from "react";

export const HistoryTimeline = (props: SVGAttributes<SVGElement>) => {
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
      <path
        d="M10.001 19L10.001 1"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.99988 18.1836L3.90894 18.1836C5.01351 18.1836 5.90894 17.2882 5.90894 16.1836L5.90894 15.2745C5.90894 14.1699 5.01351 13.2745 3.90894 13.2745L2.99988 13.2745C1.89531 13.2745 0.999882 14.1699 0.999882 15.2745L0.999882 16.1836C0.999882 17.2882 1.89531 18.1836 2.99988 18.1836Z"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M8.36463 15.7266L10.001 15.7266"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.99988 6.73047L3.90894 6.73047C5.01351 6.73047 5.90894 5.83504 5.90894 4.73047L5.90894 3.82138C5.90894 2.71681 5.01351 1.82138 3.90894 1.82138L2.99988 1.82138C1.89531 1.82138 0.999882 2.71681 0.999882 3.82138L0.999882 4.73047C0.999882 5.83504 1.89531 6.73047 2.99988 6.73047Z"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M8.36463 4.27344L10.001 4.27344"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.0001 7.54297L16.0911 7.54297C14.9865 7.54297 14.0911 8.4384 14.0911 9.54297L14.0911 10.4521C14.0911 11.5566 14.9865 12.4521 16.0911 12.4521L17.0001 12.4521C18.1047 12.4521 19.0001 11.5566 19.0001 10.4521L19.0001 9.54297C19.0001 8.4384 18.1047 7.54297 17.0001 7.54297Z"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M11.6377 10L10.0013 10"
        stroke="#ADB2B2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
