import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { CompanyData, CompanyDuplicateReviewData } from "~/service/types";
import { useCompanyDuplicateReviews } from "./hooks/useCompanyDuplicateReviews";
import { Duplicate } from "~/icons/records/Duplicate";
import { Arrow } from "~/icons/ui/Arrow";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useRouter } from "next/router";

interface DuplicateBannerProps {
  companyId: string;
}

function DuplicateBannerItem({
  review,
  companyId,
}: {
  review: CompanyDuplicateReviewData;
  companyId: string;
}) {
  const otherCompanyId =
    review.source_company_id === companyId
      ? review.target_company_id
      : review.source_company_id;

  const { data: otherCompany } = useQuery({
    queryKey: ["companies", otherCompanyId],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyData>(
        `/companies/find/${otherCompanyId}`
      );
      return data;
    },
  });

  const otherName = otherCompany?.name ?? "...";
  const router = useRouter();

  const handleClick = () => {
    useLeftMenuStore.getState().activateItem("company-duplicates/main" as any);
    useLeftMenuStore.getState().setSelectedCompanyDuplicateReviewId(review.id);
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-[12px] w-full cursor-pointer bg-gradient-2 rounded-[8px] border border-solid border-gray-moderate px-[12px] py-[10px] transition-all duration-[120ms] ease-out hover:border-[#4A4C4E]"
    >
      <div className="w-[28px] h-[28px] min-w-[28px] bg-[#375751] rounded-[6px] flex items-center justify-center">
        <Duplicate className="text-strong-green w-[16px] h-[14px]" />
      </div>

      <div className="flex flex-col text-left truncate">
        <span className="text-display-14 text-text-moderate truncate">
          Duplicate detected
        </span>
        <span className="text-display-12 text-text-weak truncate">
          {otherName} · Click to review
        </span>
      </div>

      <Arrow
        className="ml-auto shrink-0 text-text-weak rotate-90 group-hover:text-strong-green transition-colors duration-[120ms] ease-out"
        width={10}
        height={7}
      />
    </button>
  );
}

export const DuplicateBanner = ({ companyId }: DuplicateBannerProps) => {
  const reviews = useCompanyDuplicateReviews(companyId);

  if (reviews.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-[8px] px-[12px] py-[12px]">
        {reviews.map((review) => (
          <DuplicateBannerItem
            key={review.id}
            review={review}
            companyId={companyId}
          />
        ))}
      </div>
      <div className="h-[20px] border-b-gray-moderate border-b mx-[-8px] mb-[4px]" />
    </>
  );
};
