import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import styles from "./Overlay.module.scss";

interface Props {
  children: React.ReactNode;
}

const Overlay = ({ children }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // forbid scroll outside of the div
  useEffect(() => {
    const preventScroll = (event: WheelEvent | TouchEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        event.preventDefault();
      }
    };

    // Add event listeners
    document.body.addEventListener("wheel", preventScroll, { passive: false });
    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      // Remove event listeners
      document.body.removeEventListener("wheel", preventScroll);
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={overlayRef}>{children}</div>
    </motion.div>
  );
};

export default Overlay;
