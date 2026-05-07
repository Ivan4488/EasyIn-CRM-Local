import { useEffect } from "react";
import { uid } from "~/lib/utils/uid";
import { Property, usePropertiesStore } from "~/stores/propertiesStore";
import { EmailListDropdown } from "./EmailListDropdown";
import { MailboxLabelRow } from "./MailboxDropdown";

type EmailEntry = {
  id?: string;
  email: string;
  source: string;
  isPrimary?: boolean;
  action?: 'do-not-use' | 'bad-email' | null;
  companyName?: string;
};

const getEmails = (property: Property): EmailEntry[] =>
  Array.isArray(property.jsonValue) ? (property.jsonValue as EmailEntry[]) : [];

interface ContactEmailsModalProps {
  property: Property;
  propertyNode: JSX.Element;
  onClose: () => void;
}

export const ContactEmailsModal = ({
  property,
  propertyNode,
  onClose,
}: ContactEmailsModalProps) => {
  const { properties, setProperties } = usePropertiesStore();

  // Get the current property from the store to reflect local updates
  const currentProperty = properties.find((p) => p.id === property.id) || property;
  const emails = getEmails(currentProperty);

  const companyDomain = properties.find(
    (p) => p.title === "Company domain"
  )?.stringValue;

  const companyName = properties.find(
    (p) => p.title === "Company Name"
  )?.stringValue;

  // Create placeholder entries for slots that don't have email entries yet
  useEffect(() => {
    const newEntries: EmailEntry[] = [];
    let maxSortOrder = emails.reduce(
      (max, e) => Math.max(max, (e as any).sortOrder || 0),
      0
    );

    // LinkedIn slot
    if (!emails.some((e) => e.source === "LinkedIn")) {
      const hasPrimary = emails.some((e) => e.isPrimary);
      newEntries.push({
        id: uid(),
        email: "",
        source: "LinkedIn",
        isPrimary: !hasPrimary,
        action: null,
      });
    }

    // Additional slot
    if (!emails.some((e) => e.source === "Additional")) {
      newEntries.push({
        id: uid(),
        email: "",
        source: "Additional",
        isPrimary: false,
        action: null,
      });
    }

    if (newEntries.length === 0) return;

    const entriesWithSort = newEntries.map((entry) => ({
      ...entry,
      sortOrder: ++maxSortOrder,
    }));

    const updatedEmails = [...emails, ...entriesWithSort];
    setProperties(
      properties.map((p) =>
        p.id === property.id
          ? { ...currentProperty, jsonValue: updatedEmails }
          : p
      )
    );
  }, []);

  const handleSetPrimary = (id: string) => {
    const updatedEmails = emails.map((email) => ({
      ...email,
      isPrimary: email.id === id,
      ...(email.id === id ? { action: null } : {}),
    }));

    const newPrimaryEmail = emails.find((email) => email.id === id);
    if (!newPrimaryEmail) return;

    const updatedProperty: Property = {
      ...currentProperty,
      stringValue: newPrimaryEmail.email,
      jsonValue: updatedEmails,
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p
    );
    setProperties(updatedProperties);
  };

  const handleSetAction = (id: string, action: 'do-not-use' | 'bad-email' | null) => {
    const updatedEmails = emails.map((email) =>
      email.id === id ? { ...email, action } : email
    );

    const updatedProperty: Property = {
      ...currentProperty,
      jsonValue: updatedEmails,
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p
    );
    setProperties(updatedProperties);
  };

  const handleEditEmail = (id: string, newEmail: string) => {
    const updatedEmails = emails.map((email) =>
      email.id === id ? { ...email, email: newEmail } : email
    );

    const editedEmail = updatedEmails.find((e) => e.id === id);
    const updatedProperty: Property = {
      ...currentProperty,
      stringValue: editedEmail?.isPrimary ? newEmail : currentProperty.stringValue,
      jsonValue: updatedEmails,
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p
    );
    setProperties(updatedProperties);
  };

  const handleDeleteEmail = (id: string) => {
    const deletedEmail = emails.find((e) => e.id === id);
    const updatedEmails = emails.filter((email) => email.id !== id);

    // If deleted email was primary, set the first remaining email as primary
    if (deletedEmail?.isPrimary && updatedEmails.length > 0) {
      updatedEmails[0] = { ...updatedEmails[0], isPrimary: true, action: null } as EmailEntry;
    }

    const newPrimary = updatedEmails.find((e) => e.isPrimary && !e.action);

    const updatedProperty: Property = {
      ...currentProperty,
      stringValue: newPrimary?.email ?? "",
      jsonValue: updatedEmails,
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p
    );
    setProperties(updatedProperties);
  };

  const handleAddEmail = (email: string) => {
    const isFirstEmail = emails.length === 0;
    const maxSortOrder = emails.reduce(
      (max, e) => Math.max(max, (e as any).sortOrder || 0),
      0
    );

    const newEmailEntry = {
      id: uid(),
      email: email,
      source: "Additional",
      status: "valid",
      isPrimary: isFirstEmail,
      action: null,
      sortOrder: maxSortOrder + 1,
    };

    const updatedEmails = [...emails, newEmailEntry];

    const updatedProperty: Property = {
      ...currentProperty,
      stringValue: isFirstEmail ? email : currentProperty.stringValue,
      jsonValue: updatedEmails,
    };

    // Update local state only - will be saved via standard update flow
    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p
    );
    setProperties(updatedProperties);
  };

  return (
    <div className="relative w-full">
      <div className="w-full opacity-0 pointer-events-none">{propertyNode}</div>
      <div className="absolute inset-0 z-[300] pointer-events-none">
        <div className="flex flex-col w-full">
          <div className="pointer-events-auto">
            <MailboxLabelRow title={property.title} onClose={onClose} />
          </div>
          <div className="pointer-events-auto">
            <EmailListDropdown
              emails={emails}
              companyDomain={companyDomain}
              companyName={companyName}
              onSetPrimary={handleSetPrimary}
              onAddEmail={handleAddEmail}
              onSetAction={handleSetAction}
              onEditEmail={handleEditEmail}
              onDeleteEmail={handleDeleteEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
