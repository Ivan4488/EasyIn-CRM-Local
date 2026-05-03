import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { BackHeaderRectangle } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { Settings } from "~/icons/ui/Settings";
import { MiddleCutOut } from "~/components/UI/MiddleSection/MiddleCutOut";
import { SettingCard } from "./SettingCard";
import { TooltipContent } from "~/components/UI/Tooltip/tooltip";
import { Tooltip, TooltipTrigger } from "~/components/UI/Tooltip/tooltip";
import { TooltipProvider } from "~/components/UI/Tooltip/tooltip";
import { Info } from "~/icons/ui/Info";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  settingsListConversation,
  settingsListProperties,
} from "~/stores/watchAndUpdateSectionStore";
export const WatchAndUpdateSettings = () => {
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const onBackButtonClick = () => {
    rightMenuNavigationStore.setMiddleSection("default");
  };

  return (
    <MiddleSection>
      <BackHeaderRectangle
        title="Auto update settings"
        onClick={onBackButtonClick}
        onClose={onBackButtonClick}
        Icon={ContactIcon}
        isRoundClose={true}
        AvatarIcon={Settings}
        roundCloseTitle="Close"
      />

      <div className="flex justify-center">
        <MiddleCutOut>
          <Scrollbar
            className="flex flex-col gap-[16px] h-full p-[16px]"
            everPresent
          >
            <div className="w-full h-[48px] flex items-center justify-between p-[16px] border-b border-gray-moderate">
              <div className="text-display-16 font-semibold">LinkedIn data</div>
            </div>

            <div className="flex flex-col gap-[16px] p-[16px]">
              <div className="text-display-12 font-bold text-text-weak">
                CONVERSATION DATA
              </div>

              {settingsListConversation.map((item) => (
                <SettingCard
                  key={item.title}
                  section="conversation"
                  title={item.title}
                  subtitle={item.subtitle}
                />
              ))}
            </div>

            <div className="flex flex-col gap-[16px] p-[16px] mt-[24px]">
              <div className="flex flex-row items-center justify-start gap-[8px]">
                <div className="text-display-12 font-bold text-text-weak">
                  PROPERTIES
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="text-text-weak" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Enabling this features means your existing data will be
                        overwritten when newer LinkedIn data is available
                      </p>
                      <TooltipArrow className="fill-gray-moderate" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {settingsListProperties.map((item) => (
                <SettingCard
                  key={item.title}
                  section="properties"
                  title={item.title}
                />
              ))}
            </div>
          </Scrollbar>
        </MiddleCutOut>
      </div>
    </MiddleSection>
  );
};
