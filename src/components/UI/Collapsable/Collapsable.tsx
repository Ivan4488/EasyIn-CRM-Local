import { motion } from "framer-motion";

interface CollapsableProps {
  defaultOpen?: boolean;
  key: string;
  children: React.ReactNode;
  fade?: boolean;
  shiftY?: number;
}

const DURATION = 0.35;

export const Collapsable = ({
  defaultOpen,
  key,
  children,
  fade = false,
  shiftY = 0,
}: CollapsableProps) => {
  return (
    <motion.div
      className="overflow-hidden"
      initial={{
        height: defaultOpen ? "auto" : 0,
        opacity: fade ? 0 : 1,
        marginTop: 0,
      }}
      animate={{
        height: "auto",
        opacity: 1,
        marginTop: 0,
        transition: {
          height: {
            duration: DURATION,
          },
          marginTop: {
            duration: DURATION,
          },
          opacity: {
            duration: DURATION,
            delay: DURATION,
          },
        },
      }}
      exit={{
        height: 0,
        marginTop: `${shiftY}px`,
        opacity: fade ? 0 : 1,
        transition: {
          height: {
            duration: DURATION,
            delay: fade ? DURATION : 0,
          },
          marginTop: {
            duration: DURATION,
            delay: fade ? DURATION : 0,
          },
          opacity: {
            duration: DURATION,
          },
        },
      }}
      key={key}
    >
      {children}
    </motion.div>
  );
};
