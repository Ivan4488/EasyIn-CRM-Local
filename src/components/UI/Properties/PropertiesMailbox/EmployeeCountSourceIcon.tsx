import { usePropertiesStore } from "~/stores/propertiesStore";

import { isUserAddedEmployeeCountEntry, LABEL_TO_KIND, type EmployeeCountEntry } from "~/utils/employeeCount";

interface EmployeeCountSourceIconProps {
  propertyId: string;
}

const getPrimaryIcon = (entries: EmployeeCountEntry[]) => {
  const primaryEntry = entries.find((entry) => entry.isPrimary);
  if (!primaryEntry) return "range";
  if (isUserAddedEmployeeCountEntry(primaryEntry)) return "custom";
  return LABEL_TO_KIND[primaryEntry.label] ?? "range";
};

export const EmployeeCountSourceIcon = ({
  propertyId,
}: EmployeeCountSourceIconProps) => {
  const propertiesStore = usePropertiesStore();
  const property = propertiesStore.getPropertyById(propertyId);

  const entries = Array.isArray(property?.jsonValue)
    ? (property?.jsonValue as EmployeeCountEntry[])
    : [];

  const icon = getPrimaryIcon(entries);

  return (
    <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center bg-[#3E5552] text-white/60">
      {icon === "low" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "high" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "range" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 8L4.8 5.25M1.5 8L4.8 10.75M14.5 8L11.2 5.25M14.5 8L11.2 10.75M4.8 8H11.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "custom" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.4707 11.1244C12.4707 12.0209 11.6972 12.7476 10.7429 12.7476C9.78869 12.7476 9.01514 12.0209 9.01514 11.1244C9.01514 10.228 9.78869 9.50136 10.7429 9.50136C11.6972 9.50136 12.4707 10.228 12.4707 11.1244Z" fill="currentColor"/>
          <path d="M9.25134 13.9406H12.2048V22.9302H9.25134V13.9406Z" fill="currentColor"/>
          <path d="M16.9597 13.9406H14.0063V22.9302H16.9597C16.9597 22.9302 16.9597 20.1002 16.9597 18.3307C16.9597 17.2686 17.3208 16.2019 18.7613 16.2019C20.3894 16.2019 20.3795 17.5918 20.372 18.6686C20.3621 20.076 20.3857 21.5124 20.3857 22.9302H23.3392V18.1857C23.3142 15.1562 22.5283 13.7603 19.9427 13.7603C18.4072 13.7603 17.4555 14.4605 16.9597 15.094V13.9406Z" fill="currentColor"/>
        </svg>
      )}
    </div>
  );
};
