import { useRouter } from "next/router";
import { ComboboxItem } from "~/components/UI/Combobox/Combobox";
import { PropertiesEdit } from "~/components/UI/Properties/PropertiesEdit/PropertiesEdit";
import { PropertiesList } from "~/components/UI/Properties/RightMenuPropertiesList/PropertiesList";
import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";

interface Props {
  isDisabled?: boolean;
}

export const RightMenuDefaultSection = ({ isDisabled }: Props) => {
  const {
    propertiesSection,
    setPropertiesSection,
    setFullHeightSection,
  } = useRightMenuNavigationStore();
  const { middleSection, isSectionFullHeight } = useRightMenuNavigationStore();

  const sectionMenuItems: ComboboxItem[] = [
    { value: "edit", label: "Layout" },
    { type: "separator" },
    { value: "settings", label: "Manage properties" },
  ];

  const router = useRouter();

  const { id } = router.query;

  const onPropertiesSectionChange = (value: string) => {
    switch (value) {
      case "edit":
        setPropertiesSection(value);
        setFullHeightSection("account-properties");
        break;
      case "settings":
        sessionStorage.setItem('propertiesReturnUrl', router.asPath);
        router.push(`/accounts/settings/${id}`);
        break;
      default:
        setPropertiesSection("default");
    }
  };

  const isRightMenuDisabled = isDisabled || middleSection !== "default";

  return (
    <MenuSectionCollapsible
      title="ACCOUNT PROPERTIES"
      id="account-properties"
      defaultActive
      hasFullHeight
      hideIfOtherFullHeight={true}
      menuItems={sectionMenuItems}
            hideMenu={propertiesSection !== "default"}
      onMenuChangeCallback={onPropertiesSectionChange}
    >
      {propertiesSection === "default" ? (
        <PropertiesList isDisabled={isRightMenuDisabled} context="accounts" />
      ) : (
        <PropertiesEdit isDisabled={isRightMenuDisabled} />
      )}
    </MenuSectionCollapsible>
  );
};
