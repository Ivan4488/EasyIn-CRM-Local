import { useRouter } from "next/router";
import { ContactCompanyAssociationSection } from "~/components/ContactCompanyAssociationSection/ContactCompanyAssociationSection";
import { PropertiesEdit } from "~/components/UI/Properties/PropertiesEdit/PropertiesEdit";
import { ComboboxItem } from "~/components/UI/Combobox/Combobox";
import { PropertiesList } from "~/components/UI/Properties/RightMenuPropertiesList/PropertiesList";
import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { SectionDivider } from "~/components/UI/SideMenu/SectionDivider";
import { DuplicateBanner } from "./DuplicateBanner";

interface Props {
  isDisabled?: boolean;
}

export const RightMenuDefaultSection = ({ isDisabled }: Props) => {
  const {
    propertiesSection,
    associationSection,
    setPropertiesSection,
    setFullHeightSection,
    isSectionFullHeight,
  } = useRightMenuNavigationStore();

  const router = useRouter();

  const sectionMenuItems: ComboboxItem[] = [
    { value: "edit", label: "Layout" },
    { type: "separator" },
    { value: "settings", label: "Manage properties" },
  ];

  const { id } = router.query;

  const onPropertiesSectionChange = (value: string) => {
    switch (value) {
      case "edit":
        setPropertiesSection(value);
        setFullHeightSection("company-properties");
        break;
      case "settings":
        sessionStorage.setItem('propertiesReturnUrl', router.asPath);
        router.push(`/companies/settings/${id}`);
        break;
      default:
        setPropertiesSection("default");
    }
  };

  const companyId = typeof id === "string" ? id : "";

  return (
    <>
      {companyId && <DuplicateBanner companyId={companyId} />}

      <ContactCompanyAssociationSection />

      {associationSection === "default" && (
        <>
          <SectionDivider
            id="company-contacts"
            hasFullHeight
            isHidden={isSectionFullHeight("company-contacts")}
          />
          <MenuSectionCollapsible
            title="COMPANY PROPERTIES"
            id="company-properties"
            defaultActive
            hasFullHeight
            hideIfOtherFullHeight={true}
            menuItems={sectionMenuItems}
            hideMenu={propertiesSection !== "default"}
            onMenuChangeCallback={onPropertiesSectionChange}
          >
            {propertiesSection === "default" ? (
              <PropertiesList isDisabled={isDisabled} context="companies" />
            ) : (
              <PropertiesEdit isDisabled={isDisabled} />
            )}
          </MenuSectionCollapsible>
        </>
      )}
    </>
  );
};
