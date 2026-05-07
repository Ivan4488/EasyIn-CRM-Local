import classNames from "classnames";
import styles from "./Scrollbar.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  everPresent?: boolean;
  children: React.ReactNode;
}

export const Scrollbar = ({
  children,
  className,
  everPresent,
  ...props
}: Props) => {
  return (
    <div
      className={classNames(
        className,
        styles.scrollbar,
        everPresent ? "overflow-y-scroll" : "overflow-y-auto"
      )}
      {...props}
    >
      {children}
    </div>
  );
};
