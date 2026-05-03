import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { ConvoStatus } from "../Response/ConvoStatus/ConvoStatus";
import { useQuery } from "@tanstack/react-query";
import { ContactData } from "~/service/types";
import { axiosClient } from "~/service/axios";
import { useRouter } from "next/router";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { RightMenuPropertiesWrapper } from "~/components/UI/RightMenu/RightMenuPropertiesWrapper";
import { PropertiesEdit } from "~/components/UI/Properties/PropertiesEdit/PropertiesEdit";
import { PropertiesList } from "~/components/UI/Properties/RightMenuPropertiesList/PropertiesList";
import { ContactCompanyAssociationSection } from "~/components/ContactCompanyAssociationSection/ContactCompanyAssociationSection";
import { WatchAndUpdateSection } from "~/components/WatchAndUpdateSection/WatchAndUpdateSection";
import { ComboboxItem } from "~/components/UI/Combobox/Combobox";
import { SectionDivider } from "~/components/UI/SideMenu/SectionDivider";
import { RightMenuSectionMediator } from "./RightMenuSectionMediator";

interface Props {
  contactId: string;
  isDisabled?: boolean;
}

export const RightMenuContact = ({ contactId, isDisabled }: Props) => {
  return (
    <RightMenuPropertiesWrapper isDisabled={isDisabled}>
      <RightMenuSectionMediator contactId={contactId} isDisabled={isDisabled} />
    </RightMenuPropertiesWrapper>
  );
};
