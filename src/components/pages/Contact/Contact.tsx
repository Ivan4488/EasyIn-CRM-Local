import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { ContactSectionMediator } from "./ContactSectionMediator";

interface ContactProps {
  contactId: string;
  isResponse?: boolean;
}

export const Contact = ({ contactId, isResponse }: ContactProps) => {
  return (
    <MiddleSection>
      <ContactSectionMediator contactId={contactId} isResponse={isResponse} />
    </MiddleSection>
  );
};
