import { PropertyType } from "~/stores/propertiesStore";

export interface PropertyHistoryResponse {
  property: Property;
  history: PropertyValue[];
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  created_at: string;
  updated_at: string;
  account_id: string;
  sortOrder: number;
  is_active: boolean;
  is_deleted: boolean;
  is_default: boolean;
  is_deletable: boolean;
  is_required: boolean;
}

export interface PropertyValue {
  id: string;
  contactId: string;
  propertyId: string;
  textValue: string;
  numberValue?: number | null;
  dateValue: string | null;
  jsonValue?: unknown; // For CONTACT_EMAILS - stores email array
  selectOptions: SelectOption[];
  created_at: string;
  updated_at: string;
  valid_from: string;
  valid_to?: string;
  is_current: boolean;
}

export interface SelectOption {
  id: string;
  value: string;
  contactPropertyId: string;
  sortOrder: number;
}

export type RecordType = "message" | "contact" | "company" | string;

export interface RecordsResponse {
  records: RecordData[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export type RecordContent = ContactData | CompanyData | MessageData;

export interface RecordData {
  type: RecordType;
  page: number;
  limit: number;
  data: RecordContent;
}

export type ConversationStatus = "active" | "closed" | "snoozed" | string;

export interface LinkedinAccount {
  id: string;
  name: string;
  url: string;
}

export interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  userName?: string;
  account_id: string;
  company_id: string;
  conversation_status: ConversationStatus;
  snooze_until?: string;
  linkedinAccounts?: LinkedinAccount[];
}

export interface CompanyData {
  id: string;
  name: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  account_id: string;
}

type SenderReceiver = "user" | "contact";

export interface MessageData {
  id: string;
  text: string;
  created_at: string;
  updated_at: string;
  platform: string;
  subject: string;
  sender: SenderReceiver;
  sender_name: string;
  receiver: SenderReceiver;
  user_id: string;
  contact_id: string;
  account_id: string;
  User: UserData;
  Contact: ContactData;
  contact_email?: string;
}

export interface MessageResponseData {
  id: string; // UUID
  text: string; // HTML content as a string
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  platform: "email"; // Literal type, can be expanded to other platforms
  subject: string; // Subject of the communication, can be empty
  sender: string; // Identifier for the sender
  receiver: string; // Identifier for the receiver
  user_id: string; // UUID of the user
  contact_id: string; // UUID of the contact
  account_id: string; // UUID of the account
  email: string; // Email address
  name: string; // Name of the sender or contact
  phone: string; // Phone number
  company_id: string; // UUID of the company
}

export interface MessagesResponse {
  messages: MessageResponseData[];
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  created_at: string;
  updated_at: string;
  account_id: string;
  is_invite_accepted: boolean;
}

export interface AccountData {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  is_active: boolean;
}

// ─── Duplicate Review Types ─────────────────────────────────────────

export interface DuplicateReviewData {
  id: string;
  created_at: string;
  source_contact_id: string;
  target_contact_id: string;
  matched_by: string;
  matched_value: string | null;
  status: "pending" | "merged" | "dismissed";
}

export interface DuplicateReviewsResponse {
  reviews: DuplicateReviewData[];
}

export interface CompanyDuplicateReviewData {
  id: string;
  created_at: string;
  source_company_id: string;
  target_company_id: string;
  matched_by: string;
  matched_value: string | null;
  status: "pending" | "merged" | "dismissed";
}

export interface CompanyDuplicateReviewsResponse {
  reviews: CompanyDuplicateReviewData[];
}

export function isContactData(
  recordData: RecordData
): recordData is RecordData & { data: ContactData } {
  return recordData.type === "contact";
}

// Type guard for CompanyData
export function isCompanyData(
  recordData: RecordData
): recordData is RecordData & { data: CompanyData } {
  return recordData.type === "company";
}

// Type guard for MessageData
export function isMessageData(
  recordData: RecordData
): recordData is RecordData & { data: MessageData } {
  return recordData.type === "message";
}
