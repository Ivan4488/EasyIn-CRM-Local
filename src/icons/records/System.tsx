import classNames from "classnames";
import { SVGAttributes } from "react";

export const System = (props: SVGAttributes<SVGElement>) => {
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
        d="M7.9 2V5.1M12.1 2V5.1M7.9 14.9V18M12.1 14.9V18M14.9 7.9H18M14.9 11.4H18M2 7.9H5.1M2 11.4H5.1M8.46 14.9H11.54C12.7161 14.9 13.3042 14.9 13.7534 14.6711C14.1485 14.4698 14.4698 14.1485 14.6711 13.7534C14.9 13.3042 14.9 12.7161 14.9 11.54V8.46C14.9 7.28389 14.9 6.69583 14.6711 6.24662C14.4698 5.85148 14.1485 5.53022 13.7534 5.32889C13.3042 5.1 12.7161 5.1 11.54 5.1H8.46C7.28389 5.1 6.69583 5.1 6.24662 5.32889C5.85148 5.53022 5.53022 5.85148 5.32889 6.24662C5.1 6.69583 5.1 7.28389 5.1 8.46V11.54C5.1 12.7161 5.1 13.3042 5.32889 13.7534C5.53022 14.1485 5.85148 14.4698 6.24662 14.6711C6.69583 14.9 7.28389 14.9 8.46 14.9Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
