import { useWatchAndUpdateSectionStore } from "~/stores/watchAndUpdateSectionStore";
import { DataSync } from "./DataSync/DataSync";
import { MenuSectionWatchAndUpdate } from "./MenuSectionWatchAndUpdate/MenuSectionWatchAndUpdate";
import classNames from "classnames";

export const WatchAndUpdateSection = () => {
  const { isActive } = useWatchAndUpdateSectionStore();

  return (
    <MenuSectionWatchAndUpdate title="WATCH & UPDATE" id="auto-update" defaultActive>
      <div className="px-[12px]">
        <DataSync />
      </div>

      <div
        className={classNames("px-[12px]", {
          "text-text-weak": isActive,
          "text-text-disabled": !isActive,
        })}
      >
        <div className="p-[16px] mt-[12px] bg-hover-1 rounded-[8px] border border-b1-stroke">
          <div className="flex flex-row justify-start items-center gap-[12px]">
            <div className="w-[40px] h-[40px] border border-b1-stroke rounded-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18.2439 2.25H21.5519L14.3249 10.51L22.8269 21.75H16.1699L10.9559 14.933L4.98991 21.75H1.67991L9.40991 12.915L1.25391 2.25H8.07991L12.7929 8.481L18.2439 2.25ZM17.0829 19.77H18.9159L7.08391 4.126H5.11691L17.0829 19.77Z"
                  fill={isActive ? "#ADB2B2" : "#525758"}
                />
              </svg>
            </div>
            <div className="text-display-14 font-medium">
              <p className="font-semibold">Need data from X?</p>
              <p className="text-display-12">(formerly Twitter)</p>
            </div>
          </div>

          <div className="gap-[12px] text-display-14 mt-[12px]">
            <span>Vote up for the </span>
            <a
              className={classNames(
                "underline cursor-pointer",
                {
                  "text-strong-green": isActive,
                  "text-green-1": !isActive,
                }
              )}
            >
              new feature here
            </a>
          </div>
        </div>

        <div className="p-[16px] mt-[12px] bg-hover-1 rounded-[8px] border border-b1-stroke">
          <div className="flex flex-row justify-start items-center gap-[12px]">
            <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] border border-b1-stroke rounded-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V17H5V13H7V17H9V9C9 8.46957 8.78929 7.96086 8.41421 7.58579C8.03914 7.21071 7.53043 7 7 7ZM7 11H5V9H7M14 7H10V17H12V13H14C14.5304 13 15.0391 12.7893 15.4142 12.4142C15.7893 12.0391 16 11.5304 16 11V9C16 8.46957 15.7893 7.96086 15.4142 7.58579C15.0391 7.21071 14.5304 7 14 7ZM14 11H12V9H14M20 9V15H21V17H17V15H18V9H17V7H21V9H20Z"
                  fill={isActive ? "#ADB2B2" : "#525758"}
                />
              </svg>
            </div>
            <div className="text-display-14 font-medium">
              <p className="font-semibold">Need data from another service?</p>
            </div>
          </div>

          <div className="gap-[12px] text-display-14 mt-[12px]">
            <span>Vote up for the </span>
            <a
              className={classNames(
                " underline cursor-pointer",
                {
                  "text-strong-green": isActive,
                  "text-green-1": !isActive,
                }
              )}
            >
              new feature here
            </a>
          </div>
        </div>
      </div>
    </MenuSectionWatchAndUpdate>
  );
};
