import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { useRouter } from "next/router";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { PropertiesEdit } from "~/components/UI/Properties/PropertiesEdit/PropertiesEdit";
import { PropertiesList } from "~/components/UI/Properties/RightMenuPropertiesList/PropertiesList";
import { ComboboxItem } from "~/components/UI/Combobox/Combobox"

interface Props {
  userId: string;
  isDisabled?: boolean;
}

const sectionMenuItems: ComboboxItem[] = [
  { value: "edit", label: "Layout" },
  { type: "separator" },
  { value: "settings", label: "Manage properties" },
];

export const RightMenuTeam = ({ userId, isDisabled }: Props) => {
  const {
    propertiesSection,
    setPropertiesSection,
    setFullHeightSection,
  } = useRightMenuNavigationStore();

  const router = useRouter();

  const onPropertiesSectionChange = (value: string) => {
    switch (value) {
      case "edit":
        setPropertiesSection(value);
        setFullHeightSection("team-member-properties");
        break;
      case "settings":
        sessionStorage.setItem('propertiesReturnUrl', router.asPath);
        router.push(`/team/settings/${userId}`);
        break;
      default:
        setPropertiesSection("default");
    }
  };

  return (
    <RightMenuPropertiesWrapper isDisabled={isDisabled}>
      <MenuSectionCollapsible
        title="PROPERTIES"
        id="team-member-properties"
        defaultActive
        hasFullHeight
        hideIfOtherFullHeight={true}
        menuItems={sectionMenuItems}
            hideMenu={propertiesSection !== "default"}
        onMenuChangeCallback={onPropertiesSectionChange}
      >
        {propertiesSection === "default" ? (
          <PropertiesList isDisabled={isDisabled} context="team" />
        ) : (
          <PropertiesEdit isDisabled={isDisabled} />
        )}
      </MenuSectionCollapsible>
    </RightMenuPropertiesWrapper>
  );
};
