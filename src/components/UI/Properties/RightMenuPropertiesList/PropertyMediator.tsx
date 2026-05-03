import { DatePicker } from "~/components/UI/Properties/Variants/DatePicker/DatePicker";
import { MultiLineInput } from "~/components/UI/Properties/Variants/MultiLineInput/MultiLineInput";
import { MultiSelect } from "~/components/UI/Properties/Variants/MultiSelect/MultiSelect";
import { SingleLineInput } from "~/components/UI/Properties/Variants/SingleLineInput";
import { NumberInput } from "~/components/UI/Properties/Variants/NumberInput";
import { SingleSelect } from "~/components/UI/Properties/Variants/SingleSelect";
import { CountrySelect } from "~/components/UI/Properties/Variants/CountrySelect";
import { StateSelect } from "~/components/UI/Properties/Variants/StateSelect";
import { RegionSelect } from "~/components/UI/Properties/Variants/RegionSelect";
import { CitySelect } from "~/components/UI/Properties/Variants/CitySelect";
import { LanguageSelect } from "~/components/UI/Properties/Variants/LanguageSelect";
import { LanguageMultiSelect } from "~/components/UI/Properties/Variants/LanguageMultiSelect/LanguageMultiSelect";
import { Property, usePropertiesStore } from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { PhotoInput } from "../Variants/PhotoInput/PhotoInput";
import { Domain } from "../Variants/Domain/Domain";
import { AccountSenderEmail } from "../Variants/AccountSenderEmail/AccountSenderEmail";
import { LinkedinProfileUrl } from "../Variants/LinkedInProfileUrl";
import { ContactEmail } from "../Variants/ContactEmail";
import { ContactEmails } from "../Variants/ContactEmails";
import { CompanyEmployeeCount } from "../Variants/CompanyEmployeeCount";
// import { ClickTooltip } from "../ClickTooltip/ClickTooltip";
import { PropertyLockType } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { ContactEmailsModal } from "../Variants/ContactEmailsModal";
import { EmployeeCountModal } from "../Variants/EmployeeCountModal";


interface Props {
  property: Property;
}

export const PropertyMediator = ({ property }: Props) => {
  let node: JSX.Element | null = null;
  switch (property.type) {
    case "SINGLE_LINE_TEXT":
      node = <SingleLineInput id={property.id} />;
      break;
    case "MULTI_LINE_TEXT":
      node = <MultiLineInput id={property.id} />;
      break;
    case "MULTI_SELECT":
      node = <MultiSelect id={property.id} />;
      break;
    case "SINGLE_SELECT":
      node = <SingleSelect id={property.id} />;
      break;
    case "COUNTRY_SELECT":
      node = <CountrySelect id={property.id} />;
      break;
    case "STATE_SELECT":
      node = <StateSelect id={property.id} />;
      break;
    case "CITY_SELECT":
      node = <CitySelect id={property.id} />;
      break;
    case "REGION_SELECT":
      node = <RegionSelect id={property.id} />;
      break;
    case "LANGUAGE_SELECT":
      node = <LanguageSelect id={property.id} />;
      break;
    case "LANGUAGE_MULTISELECT":
      node = <LanguageMultiSelect id={property.id} />;
      break;
    case "DATE":
      node = <DatePicker id={property.id} />;
      break;
    case "NUMBER":
      node = <NumberInput id={property.id} />;
      break;
    case "PHOTO":
      node = <PhotoInput id={property.id} />;
      break;
    case "DOMAIN":
      node = <Domain id={property.id} />;
      break;
    case "ACCOUNT_EMAIL":
      node = <AccountSenderEmail id={property.id} />;
      break;
    case "CONTACT_EMAIL":
      node = <ContactEmail id={property.id} />;
      break;
    case "CONTACT_EMAILS":
      node = <ContactEmails id={property.id} />;
      break;
    case "COMPANY_EMPLOYEE_COUNT":
      node = <CompanyEmployeeCount id={property.id} />;
      break;
    case "LINKEDIN_PROFILE_URL":
      node = <LinkedinProfileUrl id={property.id} />;
      break;
    default:
      node = null;
  }

  const propertiesStore = usePropertiesStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();

  const activeEditingLockTypePropertyId = propertiesStore.activeEditingLockTypePropertyId;
  const contactEmailsModalPropertyId = rightMenuNavigationStore.contactEmailsModalPropertyId;
  const employeeCountModalPropertyId = rightMenuNavigationStore.employeeCountModalPropertyId;
  const isContactEmailsModalOpen = contactEmailsModalPropertyId === property.id;
  const isEmployeeCountModalOpen = employeeCountModalPropertyId === property.id;

  if (!node) return null;

  // // Determine if tooltip should be enabled (same conditions as before)
  // const hasTooltipText =
  //   property.isInternallyManaged ||
  //   property.lockType === PropertyLockType.HIDDEN_FULLY_LOCKED ||
  //   property.lockType === PropertyLockType.VISIBLE_FULLY_LOCKED ||
  //   property.lockType === PropertyLockType.PERSONAL_DEFAULT;

  // const shouldWrapWithTooltip = hasTooltipText && activeEditingLockTypePropertyId !== property.id;
  // const propertyNode = shouldWrapWithTooltip ? (
  //   <ClickTooltip propertyId={property.id}>{node}</ClickTooltip>
  // ) : (
  //   node
  // );
  const propertyNode = node;

  if (isContactEmailsModalOpen) {
    return (
      <ContactEmailsModal
        property={property}
        propertyNode={propertyNode}
        onClose={() => rightMenuNavigationStore.setContactEmailsModalPropertyId(null)}
      />
    );
  }

  if (isEmployeeCountModalOpen) {
    return (
      <EmployeeCountModal
        property={property}
        propertyNode={propertyNode}
        onClose={() => rightMenuNavigationStore.setEmployeeCountModalPropertyId(null)}
      />
    );
  }

  return propertyNode;
};
