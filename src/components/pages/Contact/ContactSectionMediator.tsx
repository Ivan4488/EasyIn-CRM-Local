import { PhotoInputMiddle } from "~/components/UI/Properties/Variants/PhotoInput/PhotoInputMiddle";
import { ContactDefaultSection } from "./ContactDefaultSection";

import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { WatchAndUpdateSettings } from "~/components/WatchAndUpdateSection/WatchAndUpdateSettings/WatchAndUpdateSettings";

interface ContactProps {
  contactId: string;
  isResponse?: boolean;
}

export const ContactSectionMediator = ({
  contactId,
  isResponse,
}: ContactProps) => {
  const { middleSection } = useRightMenuNavigationStore();

  if (middleSection === "photo-input") {
    return <PhotoInputMiddle />;
  }

  if (middleSection === "watch-update-settings") {
    return <WatchAndUpdateSettings />;
  }

  return (
    <ContactDefaultSection contactId={contactId} isResponse={isResponse} />
  );
};
