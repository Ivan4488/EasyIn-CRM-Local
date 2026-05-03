import { useDomain } from "../hooks/useDomain";

export const DomainVerificationWarning = () => {
  const { data: domainData } = useDomain();

  const isDomainVerified = domainData?.data.isVerified;

  if (isDomainVerified) return null;
  return (
    <div className="pt-[16px] px-[20px] pb-[20px] border border-solid border-strong-yellow rounded-[12px] bg-hover-1">
      <div className="text-display-16">
        <p className="font-bold mb-[8px] text-strong-yellow">
          Waiting for DNS verification
        </p>
        <p className="text-text-weak font-[400]">
          Please add the following records to your domain registrar. This may
          take up to 48 hours to finalize.
        </p>
      </div>
    </div>
  );
};
