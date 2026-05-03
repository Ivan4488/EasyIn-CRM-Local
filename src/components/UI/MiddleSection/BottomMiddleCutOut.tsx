import { MiddleSection } from "./MiddleSection";

interface Props {
  children: React.ReactNode;
}

export const BottomMiddleCutOut = ({ children }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 grid grid-cols-[300px_auto_300px] w-full min-w-[1000px] z-[30]">
      <div className="fixed bottom-0 left-0 grid grid-cols-[300px_auto_300px] w-full min-w-[1000px] z-[30] ">
        <div></div>
        <MiddleSection>{children}</MiddleSection>
        <div></div>
      </div>
    </div>
  );
};
