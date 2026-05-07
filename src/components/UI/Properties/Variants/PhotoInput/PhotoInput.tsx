/* eslint-disable @next/next/no-img-element */
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../../PropertiesMenu/PropertiesMenu";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../../PropertiesLockTypeEdit/HiddenLine";
import { useToast } from "~/components/UI/hooks/use-toast";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";

export const PhotoInput = ({ id }: { id: string }) => {
  const propertiesStore = usePropertiesStore();
  const label = propertiesStore.getPropertyById(id)?.title;
  const placeholder = propertiesStore.getPropertyById(id)?.placeholder;
  const router = useRouter();
  const { toast } = useToast();

  const property = usePropertiesStore.getState().getPropertyById(id);
  const value = property?.stringValue;
  const linkValue = property?.linkValue;
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const middleSection = rightMenuNavigationStore.middleSection;

  const isLocked = propertiesStore.isPropertyLocked(id);
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;
  const isDownloadDisabled =
    !linkValue || isValueHidden || isLocked || isEditingLockType;

  const downloadPhoto = async () => {
    if (!linkValue || typeof window === "undefined") {
      return;
    }

    try {
      const imageUrl = getAccountImgUrl(linkValue);
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download photo");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = value || "photo.jpg";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Failed",
        description: "We couldn't download the photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onMenuChange = (menuValue: string) => {
    if (menuValue === "download-photo") {
      void downloadPhoto();
    }
  };
  const onPhotoInputClick = () => {
    rightMenuNavigationStore.setSelectedPhotoPropertyId(id);
    rightMenuNavigationStore.setMiddleSection("photo-input");

    // Update URL with the section and id parameters
    const { pathname, query } = router;
    const newQuery = {
      ...query,
      section: "photo",
      photoId: id,
    };

    router.replace(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="w-full">
      <div className="mb-[6px]">
        <label
          htmlFor={label}
          className="text-display-14 text-text-weak font-semibold "
        >
          {label}
        </label>
      </div>

      <div
        className={classNames("relative cursor-pointer h-[38px]")}
        onClick={
          !isLocked && !isEditingLockType ? onPhotoInputClick : undefined
        }
      >
        {isValueHidden && !isEditingLockType && <HiddenLine />}

        <div
          className={classNames(
            "w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
            "focus:ring-strong-green hover:ring-hover-2 pr-[5px] transition py-[9px] bg-b1-black focus:ring-1 focus:ring-inset disabled:bg-gray-7 outline-none ring-1 ring-inset ring-gray-moderate",
            isEditingLockType ? "pointer-events-none" : "",
            isLocked || isEditingLockType ? "pointer-events-none" : ""
          )}
        >
          <div
            id={label}
            className={classNames(
              "block w-full bg-b1-black border-0 text-display-14 font-[400] text-white transition placeholder:text-text-weak/40  disabled:text-text-weak min-h-[20px] h-[20px] leading-5 focus:ring-0 focus:border-0 focus:outline-none"
            )}
          >
            <p
              className={classNames("text-display-15 truncate", {
                "text-text-weak":
                  !value || isValueHidden || isLocked || isEditingLockType,
              })}
            >
              {isEditingLockType
                ? "Choose"
                : isValueHidden
                ? ""
                : value ?? (placeholder || "Insert a file")}
            </p>
          </div>
        </div>
        <PropertiesMailbox propertyId={id} propertyHeight={38} />
        <PropertiesMenu
          propertyId={id}
          topAdditionalItems={[
            {
              value: "download-photo",
              label: "Download photo",
              isDisabled: isDownloadDisabled,
            },
          ]}
          onMenuChange={onMenuChange}
          disableLock={
            !propertiesStore.getShowMailbox() || middleSection === "photo-input"
          }
        />
        {isEditingLockType && <LocksDescription propertyId={id} />}
      </div>
    </div>
  );
};
