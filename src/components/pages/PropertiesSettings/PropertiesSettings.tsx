import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Company as CompanyIcon } from "~/icons/records/Company";
import { Account as AccountIcon } from "~/icons/records/Account";
import { Team as TeamIcon } from "~/icons/records/Team";
import { BackHeaderRectangle } from "../../UI/BackHeaderRectangle/BackHeaderRectangle";
import { useRouter } from "next/router";
import { Settings } from "~/icons/ui/Settings";
import { Properties } from "./Properties/Properties";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useEffect } from "react";
import { useDeletePropertyMutation } from "./CreateProperty/hooks/useDeletePropertyMutation";
import { useProperties } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { useCloseProperties } from "./hooks/useCloseProperties";
import { PROPERTIES_CONTEXT_MAP, PropertiesContext } from "~/constants/propertiesConstants";

interface PropertySettingsProps {
  /** Present when opened from a routed record page; absent in schema-only nav mode. */
  itemId?: string;
}

export const PropertiesSettings = ({ itemId }: PropertySettingsProps) => {
  const router = useRouter();
  const closeAll = useCloseProperties();
  useProperties();

  const { copyState, resetState, commitState } = useIntermediateState(
    usePropertiesStore
  );

  const { propertiesContext } = usePropertiesStore();
  const leftMenuStore = useLeftMenuStore();

  // When rendered in detached mode (no itemId / id === "schema"), ensure the
  // correct properties nav item is active so LeftMenuMain shows the right row.
  useEffect(() => {
    if (!itemId && propertiesContext) {
      const key = PROPERTIES_CONTEXT_MAP[propertiesContext as PropertiesContext];
      if (key && !leftMenuStore.activeItems.includes(key as any)) {
        leftMenuStore.setActiveItems([key as any]);
      }
    }
  }, [itemId, propertiesContext]);

  useEffect(() => {
    copyState();
  }, []);


  const onBackButtonClick = () => {
    resetState();
    closeAll();
  };

  const mutation = useDeletePropertyMutation();

  const onSave = (ids?: string[]) => {
    commitState();
    mutation.mutate({ ids: ids ?? propertiesStore.deletedProperties });
  };

  const onCancel = () => {
    resetState();
    closeAll();
  };

  const propertiesStore = usePropertiesStore();

  const icon =
    propertiesContext === 'team' ? TeamIcon :
    propertiesContext === 'accounts' ? AccountIcon :
    propertiesContext === 'companies' ? CompanyIcon :
    ContactIcon;

  return (
    <MiddleSection>
      <BackHeaderRectangle
        title={
          propertiesContext === 'team' ? 'Team member properties' :
          propertiesContext === 'accounts' ? 'Account properties' :
          propertiesContext === 'companies' ? 'Company properties' :
          'Contact properties'
        }
        onClick={onBackButtonClick}
        onClose={closeAll}
        Icon={icon}
        isRoundClose={true}
        AvatarIcon={Settings}
        roundCloseTitle="Close"
      />

      <div className="flex justify-center h-full overflow-hidden">
        <Properties onCancel={onCancel} onSave={onSave} />
      </div>
    </MiddleSection>
  );
};
