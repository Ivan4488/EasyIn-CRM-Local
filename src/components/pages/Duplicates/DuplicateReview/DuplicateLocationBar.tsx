import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Arrow } from "~/icons/ui/Arrow";
import { Avatar } from "~/components/UI/Avatar/Avatar";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";

interface Props {
  firstName: string;
  lastName: string;
  avatar: string | null;
  onBack: () => void;
}

/**
 * Location bar for the duplicate review right panel.
 * Mirrors CompanyLocationBar from App-EasyIn exactly:
 *   [icon column] [avatar + name | BACK arrow] — whole row clickable → onBack
 *   Hover applies to inner portion only (not icon column).
 */
export const DuplicateLocationBar = ({
  firstName,
  lastName,
  avatar,
  onBack,
}: Props) => {
  const name = `${firstName} ${lastName}`.trim();
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
      {/* Icon column — gradient bg, right border, no hover */}
      <div
        className="bg-gradient-2 flex items-center justify-center shrink-0 text-text-weak"
        style={{
          width: 37,
          height: 47,
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <ContactIcon className="w-[16px] h-[16px]" />
      </div>

      {/* Inner portion — hover darkens, contains avatar + name + BACK */}
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

        {/* Back button — arrow pointing left + BACK label */}
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
