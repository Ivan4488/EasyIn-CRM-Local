import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { RightMenuSectionMediator } from "./RightMenuSectionMediator"

interface Props {
  isDisabled?: boolean;
}

export const RightMenuAccount = ({ isDisabled }: Props) => {
  return (
    <RightMenuPropertiesWrapper isDisabled={isDisabled}>
      <RightMenuSectionMediator isDisabled={isDisabled} />
    </RightMenuPropertiesWrapper>
  );
};
