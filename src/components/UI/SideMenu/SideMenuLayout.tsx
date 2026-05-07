import classNames from "classnames";
import { Scrollbar } from "../Scrollbar/Scrollbar";

interface Props {
  children: React.ReactNode;
  side?: "left" | "right";
  everPresentScrollbar?: boolean;
}

export const SideMenuLayout = ({
  children,
  side = "left",
  everPresentScrollbar,
}: Props) => {
  return (
    <>
      <Scrollbar
        everPresent={everPresentScrollbar}
        className={classNames(
          "relative w-[300px] p-[8px] z-[40]"
        )}
        style={{ background: "rgba(29, 30, 32, 0.60)" }}
      >
        {children}
      </Scrollbar>
    </>
  );
};
