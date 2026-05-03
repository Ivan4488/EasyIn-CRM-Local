import classNames from "classnames"
import { SVGAttributes } from "react"

export const Contact = (props: SVGAttributes<SVGElement>) => {
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
        d="M2 17C4.07626 14.814 6.89513 13.4706 10 13.4706C13.1049 13.4706 15.9237 14.814 18 17M14 5.97059C14 8.16348 12.2091 9.94118 10 9.94118C7.79086 9.94118 6 8.16348 6 5.97059C6 3.77769 7.79086 2 10 2C12.2091 2 14 3.77769 14 5.97059Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}