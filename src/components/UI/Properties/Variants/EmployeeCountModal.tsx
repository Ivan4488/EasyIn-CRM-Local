import { Property, usePropertiesStore } from "~/stores/propertiesStore";
import { EmployeeCountListDropdown, type EmployeeCountEntry } from "./EmployeeCountListDropdown";
import { MailboxLabelRow } from "./MailboxDropdown";
import {
  normalizeEmployeeCountEntries,
  getEmployeeCountPrimaryValue,
} from "~/utils/employeeCount";

interface EmployeeCountModalProps {
  property: Property;
  propertyNode: JSX.Element;
  onClose: () => void;
}

export const EmployeeCountModal = ({
  property,
  propertyNode,
  onClose,
}: EmployeeCountModalProps) => {
  const { properties, setProperties } = usePropertiesStore();

  const currentProperty =
    properties.find((p) => p.id === property.id) || property;

  const entries: EmployeeCountEntry[] = normalizeEmployeeCountEntries(
    currentProperty.jsonValue,
    currentProperty.stringValue ?? "",
  ) as EmployeeCountEntry[];

  const handleSetPrimary = (entryId: string) => {
    const updatedEntries = entries.map((e) => ({
      ...e,
      isPrimary: e.id === entryId,
    }));

    const updatedProperty: Property = {
      ...currentProperty,
      jsonValue: updatedEntries,
      stringValue: getEmployeeCountPrimaryValue(updatedEntries),
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p,
    );
    setProperties(updatedProperties);
  };

  const handleAddCustomCount = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const maxSortOrder = entries.reduce(
      (max, e) => Math.max(max, e.sortOrder ?? 0),
      0,
    );

    const additionalCount = entries.filter((e) =>
      (e.label || "").startsWith("Additional") || e.source === "User",
    ).length;

    const updatedEntries: EmployeeCountEntry[] = [
      ...entries,
      {
        id: `${currentProperty.id}-additional-${Date.now()}-${additionalCount + 1}`,
        label: `Additional ${additionalCount + 1}`,
        value: trimmed,
        source: "User",
        isPrimary: false,
        sortOrder: maxSortOrder + 1,
      },
    ];

    const updatedProperty: Property = {
      ...currentProperty,
      jsonValue: updatedEntries,
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p,
    );
    setProperties(updatedProperties);
  };

  const handleDeleteEntry = (entryId: string) => {
    const target = entries.find((e) => e.id === entryId);
    if (!target) return;

    const updatedEntries = entries.filter((e) => e.id !== entryId);
    const hasPrimary = updatedEntries.some((e) => e.isPrimary);

    if (!hasPrimary && updatedEntries.length > 0) {
      const firstEntry = updatedEntries[0];
      if (firstEntry) {
        updatedEntries[0] = { ...firstEntry, isPrimary: true };
      }
    }

    const updatedProperty: Property = {
      ...currentProperty,
      jsonValue: updatedEntries,
      stringValue: getEmployeeCountPrimaryValue(updatedEntries),
    };

    const updatedProperties = properties.map((p) =>
      p.id === property.id ? updatedProperty : p,
    );
    setProperties(updatedProperties);
  };

  return (
    <div className="relative w-full" data-employee-count-modal="true">
      <div className="w-full opacity-0 pointer-events-none">{propertyNode}</div>

      <div className="absolute inset-0 z-[300] pointer-events-none">
        <div className="flex flex-col w-full">
          <div className="pointer-events-auto">
            <MailboxLabelRow title={property.title} onClose={onClose} />
          </div>
          <div className="pointer-events-auto">
            <EmployeeCountListDropdown
              entries={entries}
              onSetPrimary={handleSetPrimary}
              onAddCustomCount={handleAddCustomCount}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
