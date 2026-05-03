import { DomainRecordType, DomainStatus } from "../../hooks/useDomain";
import { DnsRecordType } from "./DnsRecordType";
import { TextCopy } from "./TextCopy";
import { VerifiedStatus } from "./VerifiedStatus";

interface RowProps {
  type: DomainRecordType;
  status: DomainStatus;
  dnsKey: string;
  dnsValue: string;
  priority: number;

  isLast?: boolean;
}

export const Row = ({
  type,
  status,
  dnsKey,
  dnsValue,
  priority,
  isLast,
}: RowProps) => {
  return (
    <>
      <div className="grid grid-cols-[20px_1fr_1fr_1fr_3fr] text-text-weak font-[500] text-display-12 px-[24px] py-[16px] items-center">
        <VerifiedStatus status={status} />
        <div className="flex flex-row items-center gap-[8px]">
          <DnsRecordType type={type} />
        </div>

        <TextCopy text={dnsKey} />
        <TextCopy text={priority ? priority.toString() : undefined} />
        <TextCopy text={dnsValue} />
      </div>

      {!isLast && <div className="h-[1px] bg-gray-moderate" />}
    </>
  );
};
