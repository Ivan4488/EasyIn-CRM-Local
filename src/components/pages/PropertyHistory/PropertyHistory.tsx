import { useRouter } from "next/router";
import { BackHeaderRectangle } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { Contact as ContactIcon } from "~/icons/records/Contact";
import { HistoryTimeline } from "~/icons/ui/HistoryTimeline";
import { usePropertyHistory } from "./utils/usePropertyHistory";
import { HistoryTable } from "./HistoryTable";
import { Loader } from "~/components/UI/Loader/Loader";
import { usePropertiesStore } from "~/stores/propertiesStore"

export const PropertyHistory = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading } = usePropertyHistory();

  const propertiesStore = usePropertiesStore();
  const context = propertiesStore.propertiesContext;

  const onBackButtonClick = () => {
    router.push(`/${context}/${id}`);
  };

  return (
    <MiddleSection>
      <BackHeaderRectangle
        title="Property history"
        onClick={onBackButtonClick}
        onClose={onBackButtonClick}
        Icon={ContactIcon}
        isRoundClose={true}
        AvatarIcon={HistoryTimeline}
        roundCloseTitle="Close"
      />

      {isLoading ? (
        <div className="mt-[20px]">
          <Loader />
        </div>
      ) : (
        <HistoryTable />
      )}
    </MiddleSection>
  );
};
