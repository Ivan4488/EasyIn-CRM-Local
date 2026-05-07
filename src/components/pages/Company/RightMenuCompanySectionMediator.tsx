import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { RightMenuDefaultSection } from "./RightMenuDefaultSection";
import { PhotoInputSide } from "~/components/UI/Properties/Variants/PhotoInput/PhotoInputSide";
import { usePropertiesStore } from "~/stores/propertiesStore"
import { PropertiesLockTypeEdit } from "~/components/UI/Properties/PropertiesLockTypeEdit/PropertiesLockTypeEdit"

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
    return <PropertiesLockTypeEdit context="companies" />;
  }

  return <RightMenuDefaultSection isDisabled={isDisabled} />;
};
