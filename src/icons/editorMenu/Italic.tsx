import classNames from "classnames";
import { SVGAttributes } from "react";

export const Italic = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      className={classNames(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        className="fill-current"
        d="M9.80001 7.50008H11.4667L9.63334 15.8334H7.96667L9.80001 7.50008ZM11.2 4.16675C11.0352 4.16675 10.8741 4.21562 10.737 4.30719C10.6 4.39876 10.4932 4.52891 10.4301 4.68118C10.367 4.83345 10.3505 5.00101 10.3827 5.16266C10.4148 5.32431 10.4942 5.47279 10.6108 5.58934C10.7273 5.70588 10.8758 5.78525 11.0374 5.8174C11.1991 5.84956 11.3666 5.83305 11.5189 5.76998C11.6712 5.70691 11.8013 5.6001 11.8929 5.46306C11.9845 5.32602 12.0333 5.1649 12.0333 5.00008C12.0333 4.77907 11.9455 4.56711 11.7893 4.41083C11.633 4.25455 11.421 4.16675 11.2 4.16675Z"
      />
    </svg>
  );
};
