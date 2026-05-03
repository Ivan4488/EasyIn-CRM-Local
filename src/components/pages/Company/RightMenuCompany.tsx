import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { RightMenuSectionMediator } from "./RightMenuCompanySectionMediator"

interface Props {
  isDisabled?: boolean;
}

export const RightMenuCompany = ({ isDisabled }: Props) => {
  return (
    <RightMenuPropertiesWrapper isDisabled={isDisabled}>
      <RightMenuSectionMediator isDisabled={isDisabled} />
    </RightMenuPropertiesWrapper>
  );
};
