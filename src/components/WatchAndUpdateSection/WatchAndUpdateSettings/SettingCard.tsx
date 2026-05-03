import { Toggle } from "~/components/UI/Toggle/Toggle";
import { useWatchAndUpdateSectionStore } from "~/stores/watchAndUpdateSectionStore";

interface SettingCardProps {
  section: "conversation" | "properties";
  title: string;
  subtitle?: string;
}

export const SettingCard = ({ title, subtitle, section }: SettingCardProps) => {
  const {
    togglesMapConversation,
    togglesMapProperties,
    toggleConversation,
    toggleProperties,
  } = useWatchAndUpdateSectionStore();

  const checked =
    section === "conversation"
      ? togglesMapConversation[title]
      : togglesMapProperties[title];

  const toggle =
    section === "conversation" ? toggleConversation : toggleProperties;

  return (
    <div className="w-full min-h-[48px] flex items-center justify-between py-[8px] px-[16px] border rounded-[8px] bg-black-moderate border-gray-moderate ">
      <div>
        <div className="text-display-16 font-semibold">{title}</div>
        {subtitle && (
          <div className="text-display-14 mt-[4px] text-text-weak">
            {subtitle}
          </div>
        )}
      </div>
      <Toggle checked={checked} onCheckedChange={() => toggle(title)} />
    </div>
  );
};
