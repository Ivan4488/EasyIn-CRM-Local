import classNames from "classnames";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { Collapsable } from "../Collapsable/Collapsable";
import { AnimatePresence } from "framer-motion";

export const SectionDivider = ({
  id,
  hasFullHeight,
  isHidden,
  className,
  marginTop,
}: {
  id: string;
  hasFullHeight: boolean;
  isHidden?: boolean;
  className?: string;
  marginTop?: string;
}) => {
  const rightMenuNavigationStore = useRightMenuNavigationStore();

  let isVisible = true;
  if (
    (rightMenuNavigationStore.fullHeightSection !== id &&
      rightMenuNavigationStore.fullHeightSection !== undefined &&
      hasFullHeight) ||
    isHidden
  ) {
    isVisible = false;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isVisible && (
        <Collapsable defaultOpen={isVisible} key={`section-divider-${id}`} fade>
          <div
            className={classNames(
              "h-[20px] border-b-gray-moderate border-b mx-[-8px] mt-[0px] mb-[4px]",
              className
            )}
            style={{ marginTop: marginTop ?? "0px" }}
          />
        </Collapsable>
      )}
    </AnimatePresence>
  );
};
