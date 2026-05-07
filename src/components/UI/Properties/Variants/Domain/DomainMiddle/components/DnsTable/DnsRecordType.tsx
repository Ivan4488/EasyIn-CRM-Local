interface DnsRecordTypeProps {
  type: "MX" | "NS" | "A" | "AAAA" | "CNAME" | "TXT" | "SRV" | "CAA";
}

export const DnsRecordType = ({ type }: DnsRecordTypeProps) => {
  return (
    <div className="text-strong-blue border border-solid border-strong-blue font-[600] text-display-12 rounded-[4px] px-[8px] py-[2px]">
      {type}
    </div>
  );
};
