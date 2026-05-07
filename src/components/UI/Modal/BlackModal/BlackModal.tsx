import { ReactNode } from "react";
import { motion } from "framer-motion";

import styles from "./BlackModal.module.scss";
import Overlay from "../Overlay/Overlay";
import { Cross } from "~/icons/ui/Cross";

interface Props {
  showModal: boolean;
  closeModal(): void;
  children: ReactNode;
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

export const BlackModal = ({ showModal, closeModal, children }: Props) => {
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
            <div>
              <div className="relative w-full">
                <button
                  onClick={() => {
                    closeModal();
                  }}
                  className="z-[2] absolute right-[20px] top-[20px] border border-gray-moderate rounded flex justify-center items-center h-[28px] w-[28px]"
                >
                  <Cross className="cursor-pointer" />
                </button>
              </div>
              <div className={styles.popup__body}>{children}</div>
            </div>
          </motion.div>
        </Overlay>
      )}
    </div>
  );
};
