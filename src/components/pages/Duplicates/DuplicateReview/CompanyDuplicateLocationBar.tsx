import { Company as CompanyIcon } from "~/icons/records/Company";
import { Arrow } from "~/icons/ui/Arrow";
import { Avatar } from "~/components/UI/Avatar/Avatar";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";

interface Props {
  name: string;
  avatar: string | null;
  onBack: () => void;
}

/**
 * Location bar for the company duplicate review right panel.
 * Mirrors DuplicateLocationBar exactly, just swapped to a single `name` (companies
 * have no firstName/lastName) and the Company icon in the gradient column.
 */
export const CompanyDuplicateLocationBar = ({ name, avatar, onBack }: Props) => {
  const avatarSrc = avatar ? getAccountImgUrl(avatar) : undefined;

  return (
    <div
      onClick={onBack}
      className="flex flex-row w-full cursor-pointer shrink-0"
      style={{
        height: 47,
        background: "#1d2122",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="bg-gradient-2 flex items-center justify-center shrink-0 text-text-weak"
        style={{
          width: 37,
          height: 47,
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <CompanyIcon className="w-[16px] h-[16px]" />
      </div>

      <div
        className="flex flex-row items-center flex-1 min-w-0 transition-colors"
        style={{ paddingLeft: 10, paddingRight: 6 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "#282b2c";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <Avatar src={avatarSrc} alt={name} width={22} disableShadow />

        <p
          className="text-text-strong font-bold truncate"
          style={{ fontSize: 13, flex: 1, minWidth: 0, marginLeft: 8 }}
        >
          {name}
        </p>

        <div
          className="flex items-center shrink-0 text-text-weak"
          style={{ gap: 6, paddingRight: 4 }}
        >
          <Arrow className="-rotate-90" style={{ width: 7, height: 5 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" }}>
            BACK
          </span>
        </div>
      </div>
    </div>
  );
};
