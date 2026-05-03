import { Loader } from "~/components/UI/Loader/Loader";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyMediator } from "../../RightMenuPropertiesList/PropertyMediator";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { Button } from "~/components/UI/Buttons/Button";
import { usePhotoEditStore } from "~/stores/photoEditStore";
import { uploadSupabaseImg } from "~/service/supabase";
import { useToast } from "~/components/UI/hooks/use-toast";
import { useRouter } from "next/router";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { useEffect, useState } from "react";
import { useSaveOneProperty } from "../../RightMenuPropertiesList/utils/useSaveOneProperty";
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";

export const PhotoInputSide = () => {
  const propertiesStore = usePropertiesStore();
  const activeProperties = propertiesStore.activeProperties;
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const photoEditStore = usePhotoEditStore();
  const { currentFile, imgLink, resetState } = photoEditStore;
  const { toast } = useToast();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const { copyState } = useIntermediateState(
    usePropertiesStore,
    "propertiesListPhotoInput"
  );

  useEffect(() => {
    copyState();
  }, []);

  const { onSave: onSaveOneProperty } = useSaveOneProperty();

  const propertyId = rightMenuNavigationStore.selectedPhotoPropertyId;

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

  const onCancel = () => {
    removePhotoUrlParams();
    resetState();
    setTimeout(() => {
      rightMenuNavigationStore.setMiddleSection("default");
    }, 100);
  };

  const onSave = async () => {
    if (!propertyId) return;

    setIsSaving(true);

    if (currentFile) {
      const { data, error } = await uploadSupabaseImg({
        file: currentFile,
        bucket: "account-imgs",
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return;
      }

      if (data && data.path) {
        propertiesStore.setPropertyStringValue(propertyId, currentFile.name);
        propertiesStore.setPropertyLinkValue(propertyId, data.path);
        toast({
          title: "Success",
          variant: "success",
          description: "Image uploaded successfully",
        });
      }
    }

    if (!imgLink && !currentFile) {
      propertiesStore.setPropertyLinkValue(propertyId, undefined);
      propertiesStore.setPropertyStringValue(propertyId, undefined);
    }

    onSaveOneProperty();

    setIsSaving(false);
    removePhotoUrlParams();
    setTimeout(() => {
      rightMenuNavigationStore.setMiddleSection("default");
    }, 100);
  };

  return (
    <div className="px-[12px]">
      <div className="flex flex-col gap-[16px] ">
        {propertiesStore.isPropertiesLoading ? (
          <Loader />
        ) : (
          activeProperties
            ?.filter((property) => property.id === propertyId)
            .map((property) => (
              <PropertyMediator key={property.id} property={property} />
            ))
        )}
      </div>

      <SaveCancelButtonGroup
        onCancel={onCancel}
        onSave={onSave}
        disabled={isSaving}
        position="right"
        saveText="Update"
        show={true}
      />
    </div>
  );
};
