import { ReactNode } from "react";
import { motion } from "framer-motion";

import styles from "./Modal.module.scss";
import Overlay from "../Overlay/Overlay";
import { Button } from "../../Buttons/Button";
import { Cross } from "~/icons/ui/Cross";

interface Props {
  showModal: boolean;
  closeModal(): void;
  cancelTitle?: string;
  content: ReactNode;
  onConfirm?: () => void;
  title?: ReactNode;
  submitBtnProps?: any;
}

const dropIn = {
  hidden: {
    y: "0",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "-5px",
    opacity: 0,
  },
};

export const Modal = ({
  title,
  showModal,
  closeModal,
  content,
  onConfirm,
  cancelTitle = "Cancel",
  submitBtnProps,
}: Props) => {
  return (
    <div>
      {showModal && (
        <Overlay>
          <motion.div
            className={styles.modal_container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onConfirm && onConfirm();
                  return;
                }

                if (e.key === "Escape") {
                  closeModal();
                  return;
                }
              }}
            >
              <div className="flex flex-row items-center justify-between mb-[24px]">
                {title && <div className="text-display-18 font-bold">{title}</div>}

                <button
                  onClick={() => {
                    closeModal();
                  }}
                >
                  <Cross className="cursor-pointer" />
                </button>
              </div>
              <div className={styles.popup__body}>{content}</div>
              <div className="flex flex-row mt-[24px] gap-[8px] justify-end">
                <Button onClick={closeModal} variant="secondary">
                  {cancelTitle}
                </Button>
                {onConfirm && (
                  <Button {...submitBtnProps} onClick={onConfirm}>
                    <div>Save</div>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </Overlay>
      )}
    </div>
  );
};
