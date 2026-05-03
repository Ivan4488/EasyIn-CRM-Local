import classNames from "classnames"
import { SVGAttributes } from "react"

export const Company = (props: SVGAttributes<SVGElement>) => {
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
        d="M14.41 18V6.59282C14.41 5.68525 14.41 5.23146 14.2193 4.88482C14.0515 4.5799 13.7838 4.33199 13.4545 4.17663C13.0801 4 12.5901 4 11.61 4H8.39C7.40991 4 6.91986 4 6.54552 4.17663C6.21623 4.33199 5.94852 4.5799 5.78074 4.88482C5.59 5.23146 5.59 5.68525 5.59 6.59282V18M17 18H3"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 4L10 2"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  )
}
