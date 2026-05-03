import classNames from "classnames";
import { SVGAttributes } from "react";

export const Zap = (props: SVGAttributes<SVGElement>) => {
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
        d="M10.8333 1.66675L3.41118 10.5733C3.12051 10.9221 2.97517 11.0965 2.97295 11.2438C2.97102 11.3718 3.02808 11.4937 3.12768 11.5742C3.24226 11.6667 3.46928 11.6667 3.92333 11.6667H9.99997L9.16663 18.3334L16.5888 9.42687C16.8794 9.07806 17.0248 8.90366 17.027 8.75636C17.0289 8.62832 16.9719 8.50649 16.8723 8.426C16.7577 8.33342 16.5307 8.33342 16.0766 8.33342H9.99997L10.8333 1.66675Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
