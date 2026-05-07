import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { ContactData, DuplicateReviewData } from "~/service/types";
import { useContactDuplicateReviews } from "./hooks/useContactDuplicateReviews";
import { getContactName } from "~/lib/utils/getContactName";
import { Duplicate } from "~/icons/records/Duplicate";
import { Arrow } from "~/icons/ui/Arrow";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useRouter } from "next/router";

interface DuplicateBannerProps {
  contactId: string;
}

function DuplicateBannerItem({
  review,
  contactId,
}: {
  review: DuplicateReviewData;
  contactId: string;
}) {
  const otherContactId =
    review.source_contact_id === contactId
      ? review.target_contact_id
      : review.source_contact_id;

  const { data: otherContact } = useQuery({
    queryKey: ["contacts", otherContactId],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(
        `/contacts/find/${otherContactId}`
      );
      return data;
    },
  });

  const otherName = otherContact ? getContactName(otherContact) : "...";
  const router = useRouter();

  const handleClick = () => {
    useLeftMenuStore.getState().activateItem("duplicates/main");
    useLeftMenuStore.getState().setSelectedDuplicateReviewId(review.id);
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

export const DuplicateBanner = ({ contactId }: DuplicateBannerProps) => {
  const reviews = useContactDuplicateReviews(contactId);

  if (reviews.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-[8px] px-[12px] py-[12px]">
        {reviews.map((review) => (
          <DuplicateBannerItem
            key={review.id}
            review={review}
            contactId={contactId}
          />
        ))}
      </div>
      <div className="h-[20px] border-b-gray-moderate border-b mx-[-8px] mb-[4px]" />
    </>
  );
};
