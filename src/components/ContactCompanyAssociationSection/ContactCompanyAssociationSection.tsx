import { MenuSectionCollapsible } from "../UI/SideMenu/MenuSectionCollapsible";
import { AssociationsList } from "./AssociationsList";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { EditAssociations } from "./EditAssociations/EditAssociations";
import { usePropertiesStore } from "~/stores/propertiesStore";

export const ContactCompanyAssociationSection = () => {
  const {
    associationSection,
    setAssociationSection,
    setFullHeightSection,
    isSectionFullHeight,
  } = useRightMenuNavigationStore();

  const sectionMenuItems = [
    { type: "separator" as const },
    { value: "edit", label: "Edit" },
  ];
  const { propertiesContext } = usePropertiesStore();

  const onMenuChange = (value: string) => {
    switch (value) {
      case "default":
        setAssociationSection("default");
        break;
      case "edit":
        setAssociationSection("edit");
        setFullHeightSection("company-contacts");
        break;
    }
  };

  return (
    <MenuSectionCollapsible
      title={
        propertiesContext === "contacts"
          ? "COMPANY ASSOCIATIONS"
          : "CONTACT ASSOCIATIONS"
      }
      id="company-contacts"
      hasFullHeight
      hideIfOtherFullHeight={true}
      defaultActive
      menuItems={sectionMenuItems}
      onMenuChangeCallback={onMenuChange}
    >
      {associationSection === "default" ? (
        <AssociationsList />
      ) : (
        <EditAssociations />
      )}
    </MenuSectionCollapsible>
  );
};
