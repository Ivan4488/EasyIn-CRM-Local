import classNames from "classnames";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

type Ref = HTMLTextAreaElement;

// eslint-disable-next-line react/display-name
export const TextArea = forwardRef<Ref, InputProps>(
  ({ containerClassName, label, error, className, ...props }, ref) => {
    return (
      <div className={`${containerClassName || ""} w-full`}>
        <label
          htmlFor={label}
          className="text-display-16 text-text-weak ml-[12px] mb-[10px]"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={label}
          className={classNames(
            className,
            error
              ? "ring-strong-error"
              : "focus:ring-strong-green hover:ring-hover-2 ",
            `resize-none mt-[6px] block w-full rounded-[12px] border-0 bg-b1-black px-[12px] py-[12px] text-body-2 text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-gray-3`
          )}
          {...props}
        ></textarea>
        <p
          className={classNames(
            "ml-[12px] mt-[6px] text-display-12 text-strong-error",
            error ? "opacity-100" : "opacity-0"
          )}
        >
          {error ? error : "placeholder error"}
        </p>
      </div>
    );
  }
);
