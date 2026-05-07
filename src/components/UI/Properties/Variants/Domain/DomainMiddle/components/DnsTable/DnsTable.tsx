import { Loader } from "~/components/UI/Loader/Loader";
import {
  DomainStatus,
  ResendRecordStatus,
  useDomain,
} from "../../hooks/useDomain";
import { Row } from "./Row";

const mapStatus = (status: ResendRecordStatus): DomainStatus => {
  if (status === "verified") return "verified";
  if (status === "failed" || status === "temporary_failure") return "failed";
  return "not_started";
};

export const DnsTable = () => {
  const { data: domain, isLoading } = useDomain();

  if (isLoading) return <Loader />;
  if (!domain) return null;

  const records = domain.data.dns ?? [];

  return (
    <div className="rounded-[12px] border border-solid border-gray-moderate bg-[rgba(29, 30, 32, 0.20)]">
      <div className="grid grid-cols-[20px_1fr_1fr_1fr_3fr] text-text-weak font-[500] text-display-12 bg-hover-1 px-[24px] py-[12px] rounded-t-[12px]">
        <div></div>
        <div>Type</div>
        <div>Key</div>
        <div className="pl-[48px]">Priority</div>
        <div>Value</div>
      </div>

      <div className="h-[1px] bg-gray-moderate" />

      {records.map((record, index) => (
        <Row
          key={`${record.record}-${record.name}-${index}`}
          type={record.type}
          status={mapStatus(record.status)}
          dnsKey={record.name}
          priority={record.priority ?? 0}
          dnsValue={record.value}
          isLast={index === records.length - 1}
        />
      ))}
    </div>
  );
};
