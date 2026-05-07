/* eslint-disable @next/next/no-img-element */
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { BottomMiddleCutOut } from "~/components/UI/MiddleSection/BottomMiddleCutOut";
import { MiddleCutOut } from "~/components/UI/MiddleSection/MiddleCutOut";
import { Picture } from "~/icons/ui/Picture";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { FileWithPath, useDropzone } from "react-dropzone";
import { PlusThin } from "~/icons/ui/PlusThin";
import { EditPen } from "~/icons/ui/EditPen";
import classNames from "classnames";
import { useEffect } from "react";
import { Button } from "~/components/UI/Buttons/Button";
import { useRouter } from "next/router";
import { useProperties } from "../../RightMenuPropertiesList/hooks/useProperties";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";
import { usePhotoEditStore } from "~/stores/photoEditStore";

export const PhotoInputMiddle = () => {
  const propertiesStore = usePropertiesStore();
  const { isLoading } = useProperties();
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const router = useRouter();
  const photoEditStore = usePhotoEditStore();
  const { setCurrentFile, imgLink, setImgLink, resetState } = photoEditStore;
  const propertyId = useRightMenuNavigationStore.getState()
    .selectedPhotoPropertyId;

  const isEditMode = !!imgLink;

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    noClick: isEditMode,
  });

  useEffect(() => {
    if (!propertyId) return;

    const linkValue = propertiesStore.getPropertyById(propertyId)?.linkValue;
    if (linkValue) {
      setImgLink(getAccountImgUrl(linkValue));
    } else {
      setImgLink(null);
    }
  }, [propertyId, isLoading]);

  useEffect(() => {
    if (!propertyId) return;

    if (acceptedFiles.length > 0 ) {
      setCurrentFile(acceptedFiles[0] as FileWithPath);
      const imgUrl = URL.createObjectURL(acceptedFiles[0] as FileWithPath);
      setImgLink(imgUrl);
      propertiesStore.setPropertyStringValue(propertyId, acceptedFiles[0]?.name);
    }
  }, [acceptedFiles, isLoading]);

  // Helper function to remove section and id params from URL
  const removePhotoUrlParams = () => {
    const { pathname, query } = router;
    const { section, photoId, ...restQuery } = query;

    router.replace(
      {
        pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const onBackButtonClick = () => {
    removePhotoUrlParams();
    resetState();
    setTimeout(() => {
      rightMenuNavigationStore.setMiddleSection("default");
    }, 100);
  };

  const onDelete = () => {
    resetState();

    if (propertyId) {
      propertiesStore.setPropertyStringValue(propertyId, undefined);
      propertiesStore.setPropertyLinkValue(propertyId, undefined);
    }
  };

  return (
    <>
      <BackHeaderRound
        title={isEditMode ? "Edit image" : "Upload image"}
        onClick={onBackButtonClick}
        Icon={() => <Picture className="text-text-weak" />}
      />
      <div className="flex justify-center">
        <MiddleCutOut>
          <div className="flex flex-col items-center mt-[60px] h-full">
            <p className="text-text-weak text-display-16 font-semibold mb-[24px]">
              {propertyId
                ? propertiesStore.getPropertyById(propertyId)?.title
                : "Avatar"}
            </p>

            <div
              {...getRootProps({
                className: classNames(
                  "w-[200px] h-[200px] border border-solid border-gray-moderate relative rounded-full bg-black-moderate",
                  isEditMode
                    ? "cursor-default"
                    : "cursor-pointer hover:border-hover-2"
                ),
              })}
            >
              {isEditMode ? (
                <>
                  <img
                    src={imgLink!}
                    alt="Uploaded photo"
                    className="w-[200px] h-[200px] object-cover rounded-full"
                  />
                  <button
                    className="absolute bottom-[10px] right-[10px] w-[48px] h-[48px] flex items-center justify-center bg-text-weak rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                  >
                    <EditPen />
                  </button>
                </>
              ) : (
                <PlusThin className="text-text-weak w-[72px] h-[72px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              <input {...getInputProps()} />
            </div>

            <div className="flex justify-center mt-[24px]">
              <Button
                variant="danger"
                onClick={onDelete}
                disabled={!isEditMode}
              >
                Delete
              </Button>
            </div>
          </div>
        </MiddleCutOut>
      </div>
    </>
  );
};
