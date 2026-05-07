import { Avatar } from "../../Avatar/Avatar";
import classNames from "classnames";
import styles from "./RecordAvatar.module.scss";

interface SelectorProps {
  title: string;
  avatar?: string;
}

export const RecordAvatar = ({ title, avatar }: SelectorProps) => {
  return (
    <div className="relative w-[32px] h-[32px]">
      <div className={classNames("absolute ")}>
        <Avatar alt={title} src={avatar} />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={classNames(
          "flex relative justify-center items-center w-[32px] h-[32px] rounded-full z-[10]",
          styles.container,
          "bg-hover-1 text-black-moderate"
        )}
      >
      </button>
    </div>
  );
};
