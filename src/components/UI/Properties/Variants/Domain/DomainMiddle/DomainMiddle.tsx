import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { CircleCheck } from "~/icons/ui/CircleCheck";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { DomainTitle } from "./components/DomainTitle";
import { DomainVerificationWarning } from "./components/DomainVerificationWarning";
import { DnsTable } from "./components/DnsTable/DnsTable";
import { useDomain } from "./hooks/useDomain";
import { Loader } from "~/components/UI/Loader/Loader";
import { useEffect, useState } from "react";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";

export const DomainMiddle = () => {
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const onBackButtonClick = () => {
    rightMenuNavigationStore.setMiddleSection("default");
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  const { data, isLoading: domainIsLoading } = useDomain();
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }

    if (isRefreshClicked && data) {
      setIsRefreshClicked(false);
      toast({
        title: "Success",
        variant: "success",
        description: "Verification status refreshed",
      });
    }
  }, [data, isRefreshClicked]);

  useEffect(() => {
    setIsLoading(domainIsLoading);
  }, [domainIsLoading]);

  const onRefreshClick = () => {
    setIsLoading(true);
    setIsRefreshClicked(true);
  };

  return (
    <>
      <BackHeaderRound
        title="Verify Domain"
        onClick={onBackButtonClick}
        Icon={() => <CircleCheck className="text-text-weak" />}
      />
      <Scrollbar className="h-full" everPresent>
        {isLoading ? (
          <div className="flex flex-col p-[16px] justify-start h-full">
            <Loader />
          </div>
        ) : (
          <div className="p-[16px] flex flex-col gap-[16px]">
            <DomainTitle onRefreshClick={onRefreshClick} />
            <DomainVerificationWarning />
            <DnsTable />
          </div>
        )}
      </Scrollbar>
    </>
  );
};
