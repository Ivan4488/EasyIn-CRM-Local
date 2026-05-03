import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { RightMenuDefaultSection } from "./RightMenuDefaultSection";
import { PhotoInputSide } from "~/components/UI/Properties/Variants/PhotoInput/PhotoInputSide";
import { PropertiesLockTypeEdit } from "~/components/UI/Properties/PropertiesLockTypeEdit/PropertiesLockTypeEdit"
import { usePropertiesStore } from "~/stores/propertiesStore"

export const RightMenuSectionMediator = ({
  isDisabled,
}: {
  isDisabled?: boolean;
}) => {
  const { middleSection } = useRightMenuNavigationStore();
  const propertiesStore = usePropertiesStore();

  if (middleSection === "photo-input") {
    return <PhotoInputSide />;
  }

   if (propertiesStore.activeEditingLockTypePropertyId) {
    return <PropertiesLockTypeEdit context="accounts" />;
  }


  return <RightMenuDefaultSection isDisabled={isDisabled} />;
};
