import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { ConvoStatus } from "../Response/ConvoStatus/ConvoStatus";
import { useQuery } from "@tanstack/react-query";
import { ContactData } from "~/service/types";
import { axiosClient } from "~/service/axios";
import { useRouter } from "next/router";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { PropertiesEdit } from "~/components/UI/Properties/PropertiesEdit/PropertiesEdit";
import { PropertiesList } from "~/components/UI/Properties/RightMenuPropertiesList/PropertiesList";
import { ContactCompanyAssociationSection } from "~/components/ContactCompanyAssociationSection/ContactCompanyAssociationSection";
import { WatchAndUpdateSection } from "~/components/WatchAndUpdateSection/WatchAndUpdateSection";
import { ComboboxItem } from "~/components/UI/Combobox/Combobox";
import { SectionDivider } from "~/components/UI/SideMenu/SectionDivider";
import { DuplicateBanner } from "./DuplicateBanner";

interface Props {
  contactId: string;
  isDisabled?: boolean;
}

export const RightMenuDefaultSection = ({ contactId, isDisabled }: Props) => {
  const { data } = useQuery({
    queryKey: ["contacts", contactId],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(
        `/contacts/find/${contactId}`
      );
      return data;
    },
  });

  const {
    propertiesSection,
    associationSection,
    setPropertiesSection,
    setFullHeightSection,
    isSectionFullHeight,
  } = useRightMenuNavigationStore();

  const sectionMenuItems: ComboboxItem[] = [
    { value: "edit", label: "Layout" },
    { type: "separator" },
    { value: "settings", label: "Manage properties" },
  ];

  const router = useRouter();

  const onPropertiesSectionChange = (value: string) => {
    switch (value) {
      case "edit":
        setPropertiesSection(value);
        setFullHeightSection("contact-properties");
        break;
      case "settings":
        sessionStorage.setItem('propertiesReturnUrl', router.asPath);
        router.push(`/contacts/settings/${contactId}`);
        break;
      default:
        setPropertiesSection("default");
    }
  };

  return (
    <>
      <DuplicateBanner contactId={contactId} />

      <MenuSectionCollapsible
        title="CONVO STATUS"
        id="convo-status"
        defaultActive
        hideIfOtherFullHeight={true}
      >
        <ConvoStatus
          status={data?.conversation_status}
          snoozeUntil={data?.snooze_until}
        />
      </MenuSectionCollapsible>

      <SectionDivider id="convo-status" hasFullHeight marginTop="-9px" />

      <ContactCompanyAssociationSection />

      {associationSection === "default" && (
        <>
          <SectionDivider
            id="company-contacts"
            hasFullHeight
            isHidden={isSectionFullHeight("company-contacts")}
          />

          <MenuSectionCollapsible
            title="CONTACT PROPERTIES"
            id="contact-properties"
            defaultActive
            hasFullHeight
            hideIfOtherFullHeight={true}
            menuItems={sectionMenuItems}
            hideMenu={propertiesSection !== "default"}
            onMenuChangeCallback={onPropertiesSectionChange}
          >
            {propertiesSection === "default" ? (
              <PropertiesList isDisabled={isDisabled} context="contacts" />
            ) : (
              <PropertiesEdit isDisabled={isDisabled} />
            )}
          </MenuSectionCollapsible>
        </>
      )}

      {/* <SectionDivider id="auto-update" hasFullHeight /> */}

      {/* <WatchAndUpdateSection /> */}
    </>
  );
};
