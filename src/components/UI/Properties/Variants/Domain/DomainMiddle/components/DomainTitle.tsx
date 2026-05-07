import { CircleCross } from "~/icons/ui/CircleCross";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { useDomain } from "../hooks/useDomain";
import classNames from "classnames";
import { CircleCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface DomainTitleProps {
  onRefreshClick: () => void;
}

export const DomainTitle = ({ onRefreshClick }: DomainTitleProps) => {
  const propertiesStore = usePropertiesStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const id = rightMenuNavigationStore.domainPropertyId;
  const { data: domainData } = useDomain();
  const queryClient = useQueryClient();
  const router = useRouter();
  const accountId = router.query.id;

  if (!id) return null;

  const isDomainVerified = domainData?.data.isVerified;

  const property = propertiesStore.getPropertyById(id);

  const onRefreshClickWrapper = () => {
    queryClient.setQueryData(["domain", accountId], () => {
      return null;
    });
    onRefreshClick();
    queryClient.invalidateQueries({ queryKey: ["domain", accountId] });
  };

  return (
    <div className="flex flex-row justify-between items-center pt-[16px] px-[20px] pb-[20px] border border-solid border-gray-moderate rounded-[12px] bg-hover-1">
      <div className="flex flex-row gap-[12px] items-center">
        <div
          className={classNames(
            "py-[3px] px-[8px] rounded-[4px] flex flex-row gap-[6px] items-center text-black-moderate text-display-14",
            {
              "bg-strong-yellow": !isDomainVerified,
              "bg-strong-green": isDomainVerified,
            }
          )}
        >
          {isDomainVerified ? (
            <CircleCheck className="w-[12px] h-[12px]" />
          ) : (
            <CircleCross />
          )}
          <span>{isDomainVerified ? "Verified" : "Not verified"}</span>
        </div>

        <div className="text-display-16 font-bold">{property?.stringValue}</div>
      </div>

      <button
        className="flex flex-row text-text-weak items-center group"
        onClick={onRefreshClickWrapper}
      >
        <div className="flex flex-col justify-end relative">
          <p className="text-display-12">REFRESH</p>
          <div className="h-[1px] w-[51px] group-hover:block hidden bg-hover-2 mt-[4px] absolute right-0 top-3"></div>
        </div>
      </button>
    </div>
  );
};
