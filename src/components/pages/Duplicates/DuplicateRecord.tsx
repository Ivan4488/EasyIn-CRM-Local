import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { ContactData, DuplicateReviewData } from "~/service/types";
import { RecordLayoutWrapper } from "~/components/UI/Record/RecordLayoutWrapper";
import { Duplicate } from "~/icons/records/Duplicate";
import { Avatar } from "~/components/UI/Avatar/Avatar";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";
import { useLeftMenuStore } from "~/stores/leftMenu";

const matchedByLabel = (matchedBy: string, matchedValue: string | null): { label: string; value: string | null } => {
  switch (matchedBy) {
    case "email":            return { label: "Matched by email", value: matchedValue };
    case "name_company":     return { label: "Matched by name + company", value: matchedValue };
    case "name_jobTitle":    return { label: "Matched by name + job title", value: matchedValue };
    case "linkedin_url":     return { label: "Matched by LinkedIn URL", value: null };
    case "linkedin_profile_id": return { label: "Matched by LinkedIn", value: null };
    default:                 return { label: "Potential duplicate", value: matchedValue };
  }
};

interface Props {
  review: DuplicateReviewData;
  conflictCount: number;
  onSelect: () => void;
}

export const DuplicateRecord = ({ review, conflictCount, onSelect }: Props) => {
  const setSelectedDuplicateReviewId = useLeftMenuStore((s) => s.setSelectedDuplicateReviewId);
  const isBodySelected = useLeftMenuStore((s) => s.selectedDuplicateReviewId === review.id);

  const { data: targetContact } = useQuery({
    queryKey: ["contacts", review.target_contact_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(`/contacts/find/${review.target_contact_id}`);
      return data;
    },
  });

  const name = targetContact
    ? `${targetContact.firstName} ${targetContact.lastName}`.trim()
    : "Loading...";

  const avatarSrc = targetContact?.avatar ? getAccountImgUrl(targetContact.avatar) : undefined;
  const { label } = matchedByLabel(review.matched_by, review.matched_value);

  return (
    <RecordLayoutWrapper
      selectorKey="duplicateList"
      id={review.id}
      type="duplicate"
      onSelect={onSelect}
      onBodyClick={() => setSelectedDuplicateReviewId(review.id)}
      Icon={<Duplicate className="w-[20px] h-[20px]" />}
      hideArrow
      isBodySelected={isBodySelected}
    >
      <div className="flex items-center justify-between w-full pr-[20px] h-full self-stretch">
        <div className="flex flex-1 items-center gap-[12px] pl-[20px] overflow-hidden">
          <Avatar src={avatarSrc} alt={name} width={32} />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-display-18 font-bold text-white whitespace-nowrap">{name}</span>
            <span className="text-display-12 text-text-weak whitespace-nowrap">{label}</span>
          </div>
        </div>

        <div className="shrink-0">
          {conflictCount > 0 ? (
            <div className="h-[26px] flex flex-row gap-[6px] px-[10px] py-[4px] bg-hover-1 rounded-[4px] items-center border border-solid border-strong-blue whitespace-nowrap">
              <span className="text-display-12 font-semibold text-strong-blue">{conflictCount}</span>
              <span className="text-display-12 font-semibold text-strong-blue">Reviews</span>
            </div>
          ) : (
            <div className="h-[26px] flex flex-row px-[10px] py-[4px] bg-hover-1 rounded-[4px] items-center border border-solid border-gray-moderate whitespace-nowrap">
              <span className="text-display-12 font-semibold text-text-weak">0 Reviews</span>
            </div>
          )}
        </div>
      </div>
    </RecordLayoutWrapper>
  );
};
