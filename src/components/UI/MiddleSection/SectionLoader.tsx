import { MiddleSection } from "./MiddleSection"
import { Loader } from "../Loader/Loader";

export const SectionLoader = () => {

  return (
    <MiddleSection>
      <div className="mt-[24px]">
        <Loader />
      </div>
    </MiddleSection>
  );
};