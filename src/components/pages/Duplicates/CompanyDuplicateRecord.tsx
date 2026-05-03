import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { CompanyData, CompanyDuplicateReviewData } from "~/service/types";
import { RecordLayoutWrapper } from "~/components/UI/Record/RecordLayoutWrapper";
import { Duplicate } from "~/icons/records/Duplicate";
import { Avatar } from "~/components/UI/Avatar/Avatar";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";
import { useLeftMenuStore } from "~/stores/leftMenu";

const matchedByLabel = (matchedBy: string): string => {
  switch (matchedBy) {
    case "domain":               return "Matched by domain";
    case "name_country":         return "Matched by name + country";
    case "linkedin_url":         return "Matched by LinkedIn URL";
    case "linkedin_numeric_url": return "Matched by LinkedIn URL";
    case "linkedin_company_id":  return "Matched by LinkedIn";
    default:                     return "Potential duplicate";
  }
};

interface Props {
  review: CompanyDuplicateReviewData;
  conflictCount: number;
  onSelect: () => void;
}

export const CompanyDuplicateRecord = ({ review, conflictCount, onSelect }: Props) => {
  const setSelectedCompanyDuplicateReviewId = useLeftMenuStore(
    (s) => s.setSelectedCompanyDuplicateReviewId
  );
  const isBodySelected = useLeftMenuStore(
    (s) => s.selectedCompanyDuplicateReviewId === review.id
  );

  const { data: targetCompany } = useQuery({
    queryKey: ["companies", review.target_company_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyData>(
        `/companies/find/${review.target_company_id}`
      );
      return data;
    },
  });

  const name = targetCompany?.name ?? "Loading...";
  const avatarSrc = targetCompany?.avatar ? getAccountImgUrl(targetCompany.avatar) : undefined;
  const label = matchedByLabel(review.matched_by);

  return (
    <RecordLayoutWrapper
      selectorKey="companyDuplicateList"
      id={review.id}
      type="duplicate"
      onSelect={onSelect}
      onBodyClick={() => setSelectedCompanyDuplicateReviewId(review.id)}
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
