import { Dots } from "~/icons/ui/Dots";
import { PropertiesComboBox } from "./PropertiesComboBox";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useRouter } from "next/router";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
interface AdditionalItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface Props {
  propertyId: string;
  propertyHeight?: number;
  topAdditionalItems?: AdditionalItem[];
  middleAdditionalItems?: AdditionalItem[];
  bottomAdditionalItems?: AdditionalItem[];
  disableLock?: boolean;
  onMenuChange?: (value: string) => void;
}

export const PropertiesMenu = ({
  propertyId,
  propertyHeight,
  topAdditionalItems,
  middleAdditionalItems,
  bottomAdditionalItems,
  onMenuChange,
  disableLock,
}: Props) => {
  const propertiesStore = usePropertiesStore();
  const propertiesNavigationStore = useRightMenuNavigationStore();

  const router = useRouter();
  const { id } = router.query;

  const context = propertiesStore.propertiesContext;

  const onMenuChangeHandler = (value: string) => {
    onMenuChange?.(value);
    switch (value) {
      case "history":
        router.push(`/${context}/history/${id}/${propertyId}`);
        break;
      case "remove":
        propertiesStore.removePropertyFromActive(propertyId);
        break;
      case "edit":
        const property = propertiesStore.properties.find(
          (property) => property.id === propertyId
        );
        if (property) {
          sessionStorage.setItem('propertiesReturnUrl', router.asPath);
          router.push(`/${context}/settings/edit/${property.id}/${id}`);
        }
        break;
      case "update-settings":
        {
          const container = document.getElementById("right-menu-scroll");
          if (container) {
            propertiesNavigationStore.setRightMenuSavedScrollTop(
              container.scrollTop
            );
          }
        }
        propertiesStore.setActiveEditingLockTypePropertyId(propertyId);
        break;
    }
  };

  const property = propertiesStore.properties.find(
    (property) => property.id === propertyId
  );
  const isInternallyManaged = property?.isInternallyManaged === true;

  return (
    <div className="absolute top-[0px] right-[1px] bg-b1-black rounded-r-[8px]">
      <PropertiesComboBox
        items={[
          {
            value: "update-settings",
            label: "Update controls",
            isDisabled: disableLock || isInternallyManaged,
          },
          ...(topAdditionalItems ?? []),
          { type: "separator" },
          {
            value: "history",
            label: "History",
          },
          ...(middleAdditionalItems ?? []),
          {
            value: "edit",
            label: "Edit property",
            isDisabled: property?.isRequired,
          },
          ...(bottomAdditionalItems ?? []),
        ]}
        align="end"
        value="none"
        onChange={onMenuChangeHandler}
        name="menu"
        height={propertyHeight}
        trigger={<Dots className="w-[12px] rotate-90 h-full" />}
      />
    </div>
  );
};
