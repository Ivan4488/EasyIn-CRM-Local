import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Company as CompanyIcon } from "~/icons/records/Company";
import { Account as AccountIcon } from "~/icons/records/Account";
import { Team as TeamIcon } from "~/icons/records/Team";
import { useRouter } from "next/router";
import { Settings } from "~/icons/ui/Settings";
import { BackHeaderRectangle } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { BulkSelect } from "~/components/UI/BulkSelect/BulkSelect";
import { Input } from "~/components/UI/Input/Input";
import { Selector } from "~/components/UI/Select/Selector";
import { PropertyConfig } from "./PropertyConfig/PropertyConfig";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { useCreatePropertyMutation } from "./hooks/useCreatePropertyMutation";
import { useUpdatePropertyMutation } from "./hooks/useUpdatePropertyMutation";
import { useEffect, useState } from "react";
import { useProperties } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { useToast } from "~/components/UI/hooks/use-toast";
import { PropertyValueProjection } from "~/types/propertyValueProjection";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { useCloseProperties } from "../hooks/useCloseProperties";

const COUNTRY_FORMAT_OPTIONS = [
  { value: "alpha_2", label: "Two letter codes (US, GB, FR...)" },
  { value: "full", label: "Full country names" },
];

interface CreatePropertyProps {
  contactId: string;
  /** Called when the location bar close is triggered in schema-only (detached) mode. */
  onClose?: () => void;
}

export const CreateProperty = ({ contactId, onClose }: CreatePropertyProps) => {
  const router = useRouter();
  const { propertyId: propertyIdParam } = router.query;
  const propertyId =
    typeof propertyIdParam === "string" ? propertyIdParam : undefined;

  const { properties } = useProperties();
  const isEditProperty = Boolean(propertyId && propertyId !== "create");
  const editingProperty =
    isEditProperty && propertyId
      ? properties.find((property) => property.id === propertyId)
      : undefined;

  const propertiesStore = usePropertiesStore();
  const isCountrySelectProperty = editingProperty?.type === "COUNTRY_SELECT";
  const isStateSelectProperty = editingProperty?.type === "STATE_SELECT";
  const isRegionSelectProperty = editingProperty?.type === "REGION_SELECT";
  const isCitySelectProperty = editingProperty?.type === "CITY_SELECT";
  const isDefaultProperty = editingProperty?.isDefault ?? false;
  const isDefaultCountryProperty = isCountrySelectProperty && isDefaultProperty;
  const isDefaultStateProperty = isStateSelectProperty && isDefaultProperty;
  const isDefaultRegionProperty = isRegionSelectProperty && isDefaultProperty;
  const isDefaultCityProperty = isCitySelectProperty && isDefaultProperty;
  const isEmployeeCountProperty = editingProperty?.type === "COMPANY_EMPLOYEE_COUNT";
  const isDefaultEmployeeCountProperty = isEmployeeCountProperty && isDefaultProperty;

  const {
    propertyTypes,
    selectedPropertyType,
    setSelectedPropertyType,
    propertyTitle,
    setPropertyTitle,
    propertiesContext,
  } = propertiesStore;

  const [countryFormat, setCountryFormat] = useState<"alpha_2" | "full">("full");
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);

  useEffect(() => {
    if (!editingProperty) {
      return;
    }

    propertiesStore.setPropertyTitle(editingProperty.title);
    propertiesStore.setSelectedPropertyType({
      value: editingProperty.type,
      label: editingProperty.title,
    });
    propertiesStore.setPropertyValues(editingProperty.values || []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProperty]);

  useEffect(() => {
    if (!isEditProperty || !editingProperty) {
      return;
    }

    // Set country format for COUNTRY_SELECT properties
    if (editingProperty.type === "COUNTRY_SELECT") {
      const format = editingProperty.valueProjection?.format === "alpha_2" ? "alpha_2" : "full";
      setCountryFormat(format);
      return;
    }
  }, [editingProperty, isEditProperty]);

  const isDetached = contactId === DETACHED_PROPERTIES_ID;
  const closeAll = useCloseProperties();

  const onLocationBarClose = () => {
    closeAll();
  };

  const onBackButtonClick = () => {
    if (isDetached && onClose) {
      onClose();
    } else {
      router.push(`/${propertiesContext}/settings/${contactId}`);
    }
  };

  const onSelectPropertyType = (value: string) => {
    setSelectedPropertyType(
      propertyTypes.find((property) => property.value === value)
    );
  };

  // Save disabled only in create mode until the two required fields are filled.
  // Edit mode: always enabled (no dirty-check flash).
  const isSaveDisabled = isEditProperty
    ? isDefaultStateProperty ||
      isDefaultRegionProperty ||
      isDefaultCityProperty ||
      isDefaultEmployeeCountProperty
    : !propertyTitle.trim() ||
      !selectedPropertyType?.value ||
      isDefaultStateProperty ||
      isDefaultRegionProperty ||
      isDefaultCityProperty ||
      isDefaultEmployeeCountProperty;

  const isShowPropertyConfig =
    selectedPropertyType?.value === "MULTI_SELECT" ||
    selectedPropertyType?.value === "SINGLE_SELECT";

  const shouldShowCountryFormatSelector =
    selectedPropertyType?.value === "COUNTRY_SELECT";

  const icon =
    propertiesContext === 'team' ? TeamIcon :
    propertiesContext === 'accounts' ? AccountIcon :
    propertiesContext === 'companies' ? CompanyIcon :
    ContactIcon;

  const computeValueProjection = (): PropertyValueProjection | undefined => {
    // For COUNTRY_SELECT properties, use the selected format
    if (selectedPropertyType?.value === "COUNTRY_SELECT") {
      return { dataset: "country", format: countryFormat };
    }

    // Preserve existing projection if any
    if (editingProperty?.valueProjection) {
      return editingProperty.valueProjection;
    }

    return undefined;
  };

  const onCancelButtonClick = () => {
    // Back button — always goes one level up to the settings list, never fully closes
    router.push(`/${propertiesContext}/settings/${isDetached ? DETACHED_PROPERTIES_ID : contactId}`);
  };

  const createPropertyMutation = useCreatePropertyMutation();
  const updatePropertyMutation = useUpdatePropertyMutation();
  const propertyValues = usePropertiesStore.getState().propertyValues;
  const { toast } = useToast();

  const onSaveButtonClick = () => {
    const hasNameError = !propertyTitle.trim();
    const hasTypeError = !selectedPropertyType?.value;
    setNameError(hasNameError);
    setTypeError(hasTypeError);
    if (hasNameError || hasTypeError) return;

    const trimmedTitle = propertyTitle.trim();

    const normalizedTitle = trimmedTitle.toLowerCase();
    const hasDuplicateTitle = properties.some((property) => {
      if (property.title.trim().toLowerCase() !== normalizedTitle) {
        return false;
      }

      if (!isEditProperty) {
        return true;
      }

      return property.id !== propertyId;
    });

    if (hasDuplicateTitle) {
      toast({
        title: "Duplicate property",
        variant: "destructive",
        description: "A property with this name already exists",
      });
      return;
    }
    const valueProjectionPayload = computeValueProjection();

    // COUNTRY_SELECT properties don't have options (countries are loaded from frontend)
    const shouldSkipOptions =
      selectedPropertyType?.value === "COUNTRY_SELECT" ||
      selectedPropertyType?.value === "STATE_SELECT" ||
      selectedPropertyType?.value === "REGION_SELECT" ||
      selectedPropertyType?.value === "CITY_SELECT";

    const options = shouldSkipOptions
      ? []
      : propertyValues.map((value, index) => ({
          id: value.id.includes("default") ? undefined : value.id,
          value: value.value,
          sortOrder: index,
        }));

    const optionsToDelete = shouldSkipOptions
      ? []
      : propertiesStore.deletedPropertyValues;

    if (isEditProperty && propertyId) {
      updatePropertyMutation.mutate({
        id: propertyId,
        name: trimmedTitle,
        type: selectedPropertyType.value,
        options: options,
        optionsToDelete,
        ...(valueProjectionPayload !== undefined
          ? { valueProjection: valueProjectionPayload }
          : {}),
      });
      propertiesStore.setDeletedPropertyValues([]);
    } else {
      createPropertyMutation.mutate({
        name: trimmedTitle,
        type: selectedPropertyType.value,
        options: options,
        ...(valueProjectionPayload !== undefined
          ? { valueProjection: valueProjectionPayload }
          : {}),
      });
    }

    router.push(`/${propertiesContext}/settings/${contactId}`);
  };

  return (
    <MiddleSection>
      <BackHeaderRectangle
        title={
          propertiesContext === 'team' ? 'Team member properties' :
          propertiesContext === 'accounts' ? 'Account properties' :
          propertiesContext === 'companies' ? 'Company properties' :
          'Contact properties'
        }
        onClick={onBackButtonClick}
        onClose={onLocationBarClose}
        Icon={icon}
        isRoundClose={true}
        AvatarIcon={Settings}
        roundCloseTitle="Close"
      />

      <div className="flex justify-center overflow-hidden h-full">
        <div
          className="w-[532px] border border-t-0 border-gray-moderate flex flex-col pb-[72px]"
          style={{ background: "rgba(29, 30, 32, 0.20)" }}
        >
          <div className="w-full h-[48px] flex items-center justify-between p-[16px] opacity-20 pointer-events-none">
            <BulkSelect isChecked={false} onChange={() => void 0} />
          </div>

          <div className="w-full h-[48px] flex items-center justify-between p-[16px] border-b border-t border-gray-moderate">
            <p className="text-display-18 text-text-weak">
              {isEditProperty ? "Edit property" : "Create new property"}
            </p>
          </div>

          <Scrollbar
            everPresent
            className="p-[16px] flex flex-col gap-[16px] h-full"
          >
            <Input
              labelShifted={true}
              label="Property name"
              placeholder="Type property name"
              value={propertyTitle}
              onChange={(e) => { setPropertyTitle(e.target.value); setNameError(false); }}
              error={nameError ? "Property name is required" : undefined}
              disabled={
                isDefaultCountryProperty ||
                isDefaultStateProperty ||
                isDefaultRegionProperty ||
                isDefaultCityProperty ||
                isDefaultEmployeeCountProperty
              }
            />

            <div className={typeError ? "ring-1 ring-strong-error rounded-[8px]" : ""}>
              <Selector
                label="Property type"
                items={propertyTypes}
                onChange={(v) => { onSelectPropertyType(v); setTypeError(false); }}
                placeholder={typeError ? "Select a property type" : "Select property type"}
                value={selectedPropertyType?.value || ""}
                currentType={selectedPropertyType?.value}
                isEditProperty={isEditProperty}
                disabled={
                  isDefaultCountryProperty ||
                  isDefaultStateProperty ||
                  isDefaultRegionProperty ||
                  isDefaultCityProperty ||
                  isDefaultEmployeeCountProperty
                }
              />
            </div>
            {typeError && (
              <p className="ml-[12px] -mt-[10px] text-display-12 text-strong-error">Property type is required</p>
            )}

            {shouldShowCountryFormatSelector && (
              <Selector
                label="Country format"
                items={COUNTRY_FORMAT_OPTIONS}
                onChange={(value) => setCountryFormat(value as "alpha_2" | "full")}
                placeholder="Select country format"
                value={countryFormat}
              />
            )}

            {isShowPropertyConfig && <PropertyConfig />}
          </Scrollbar>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 grid grid-cols-[300px_auto_300px] w-full min-w-[1000px] z-[30] ">
        <div></div>
        <SaveCancelButtonGroup
          onCancel={onCancelButtonClick}
          onSave={onSaveButtonClick}
          cancelText="Back"
          position="middle"
          show={true}
          disabled={isSaveDisabled}
        />
        <div></div>
      </div>
    </MiddleSection>
  );
};
