import { useState } from "react";
import { useAssociationStore } from "~/stores/associationStore";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useItems } from "./hooks/useItems";
import { useAddAssociationMutation } from "./hooks/useAddAssociationMutation";
import { useRouter } from "next/router";
import { Loader } from "../UI/Loader/Loader";
import { ContactCompanyAssociation } from "./ContactCompanyAssociation/ContactCompanyAssociation";
import { useAssociations } from "./hooks/useAssociations";

const VISIBLE_COUNT = 3;

export const AssociationsList = () => {
  const { propertiesContext } = usePropertiesStore();
  const { associatedItems, addAssociatedItem, isLoading } = useAssociationStore();
  const { data: items } = useItems();
  useAssociations();

  const mutation = useAddAssociationMutation();
  const router = useRouter();
  const id = router.query.id as string;

  const [isExpanded, setIsExpanded] = useState(false);

  const onChange = (value: string) => {
    addAssociatedItem({
      id: value,
      name: items?.find((item) => item.value === value)?.label ?? "",
      order: 0,
    });
    const contactId = propertiesContext === "contacts" ? id : value;
    const companyId = propertiesContext === "companies" ? id : value;
    mutation.mutate({ contactId: contactId, companyId: companyId });
  };

  const total = associatedItems.length;
  const hasOverflow = total > VISIBLE_COUNT;
  const visibleItems = hasOverflow && !isExpanded
    ? associatedItems.slice(0, VISIBLE_COUNT - 1)
    : associatedItems;

  return (
    <>
      {isLoading ? (
        <div className="px-[12px] flex flex-col gap-[16px]">
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="px-[12px] flex flex-col gap-[8px]">
          {total === 0 ? (
            <p className="text-display-15 font-[600] text-text-weak/40 px-[2px]">
              No associations
            </p>
          ) : (
            <>
              {visibleItems.map((associatedItem) => (
                <ContactCompanyAssociation
                  key={associatedItem.id}
                  items={items ?? []}
                  value={associatedItem.id}
                  onChange={onChange}
                />
              ))}

              {hasOverflow && (
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="flex w-full items-center justify-center gap-[6px] border-0 bg-transparent py-[4px] outline-none opacity-60 transition hover:opacity-80"
                >
                  <span className="text-[13px] font-[600] text-text-weak">
                    {isExpanded ? "View less" : "View more"}
                  </span>
                  <svg
                    className={`h-[11px] w-[11px] text-text-weak transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
