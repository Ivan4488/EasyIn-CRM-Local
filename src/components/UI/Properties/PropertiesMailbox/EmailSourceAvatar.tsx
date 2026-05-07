import classNames from "classnames";

interface EmailSourceAvatarProps {
  source?: string;
  companyName?: string;
}

const getSourceInitial = (source: string, companyName?: string): string => {
  const lower = source.toLowerCase();
  if (lower === "company") {
    return companyName ? companyName.charAt(0).toUpperCase() : "C";
  }
  if (lower === "domain" || lower === "domain1" || lower === "domain 1") return "D1";
  if (lower === "domain2" || lower === "domain 2") return "D2";
  if (lower === "linkedin") return "L";
  if (lower === "additional") return "A";
  return source.charAt(0).toUpperCase();
};

export const EmailSourceAvatar = ({ source, companyName }: EmailSourceAvatarProps) => {
  const initial = source ? getSourceInitial(source, companyName) : "L";

  return (
    <div
      className={classNames(
        "w-[20px] h-[20px] rounded-full flex items-center justify-center",
        "text-[10px] font-semibold",
        "bg-[#3E5552] text-white/60"
      )}
    >
      {initial}
    </div>
  );
};
