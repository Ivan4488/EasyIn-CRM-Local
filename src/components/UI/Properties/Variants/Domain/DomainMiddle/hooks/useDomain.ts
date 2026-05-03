import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { axiosClient } from "~/service/axios";

export type DomainRecordType =
  | "MX"
  | "NS"
  | "A"
  | "AAAA"
  | "CNAME"
  | "TXT"
  | "SRV"
  | "CAA";

export type DomainStatus = "verified" | "not_started" | "failed";

export type DnsRecordKind =
  | "SPF"
  | "DKIM"
  | "Receiving"
  | "Tracking"
  | "TrackingCAA";

export type ResendRecordStatus =
  | "pending"
  | "verified"
  | "failed"
  | "temporary_failure"
  | "not_started";

export interface DnsRecord {
  record: DnsRecordKind;
  name: string;
  value: string;
  type: DomainRecordType;
  ttl: string;
  status: ResendRecordStatus;
  priority?: number;
}

export interface Domain {
  dns: DnsRecord[];
  isVerified: boolean;
  verify: unknown;
}

export const useDomain = () => {
  const router = useRouter();
  const accountId = router.query.id as string;

  return useQuery({
    queryKey: ["domain", accountId],
    queryFn: () => {
      return axiosClient.get<Domain>(`/accounts/${accountId}/domain`);
    },
  });
};
