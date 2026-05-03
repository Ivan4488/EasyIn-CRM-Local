// All mock data for the static UI clone.
// Single source of truth - edit this file to change what the UI displays.
import type { AccountData, ContactData, CompanyData, MessageData, TeamMember, RecordsResponse } from "~/service/types";
import type { BillingData } from "~/components/pages/Pricing/sections/PricingForm/hooks/useBilling";
import type { Property2 } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";

// Accounts
export const mockAccounts: AccountData[] = [
  { id: "account-1", name: "EasyIn", avatar: "", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", owner_id: "user-1", is_active: true },
  { id: "account-2", name: "Demo Corp", avatar: "", created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z", owner_id: "user-1", is_active: false },
];
export const mockActiveAccount: AccountData = mockAccounts[0];

// Companies
export const mockCompanies: CompanyData[] = [
  { id: "company-1", name: "Acme Corp", avatar: "", created_at: "2024-01-05T00:00:00Z", updated_at: "2024-01-05T00:00:00Z", user_id: "user-1", account_id: "account-1" },
  { id: "company-2", name: "Globex Industries", avatar: "", created_at: "2024-01-10T00:00:00Z", updated_at: "2024-01-10T00:00:00Z", user_id: "user-1", account_id: "account-1" },
  { id: "company-3", name: "Initech Solutions", avatar: "", created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z", user_id: "user-1", account_id: "account-1" },
  { id: "company-4", name: "Umbrella LLC", avatar: "", created_at: "2024-02-15T00:00:00Z", updated_at: "2024-02-15T00:00:00Z", user_id: "user-1", account_id: "account-1" },
];

// Contacts
export const mockContacts: ContactData[] = [
  { id: "contact-1", firstName: "Alice", lastName: "Johnson", avatar: "", created_at: "2024-01-10T00:00:00Z", updated_at: "2024-01-10T00:00:00Z", user_id: "user-1", userName: "alice.johnson", account_id: "account-1", company_id: "company-1", conversation_status: "active" },
  { id: "contact-2", firstName: "Bob", lastName: "Smith", avatar: "", created_at: "2024-01-12T00:00:00Z", updated_at: "2024-01-12T00:00:00Z", user_id: "user-1", userName: "bob.smith", account_id: "account-1", company_id: "company-1", conversation_status: "active" },
  { id: "contact-3", firstName: "Carol", lastName: "Williams", avatar: "", created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z", user_id: "user-1", userName: "carol.w", account_id: "account-1", company_id: "company-2", conversation_status: "closed" },
  { id: "contact-4", firstName: "David", lastName: "Brown", avatar: "", created_at: "2024-01-18T00:00:00Z", updated_at: "2024-01-18T00:00:00Z", user_id: "user-1", userName: "david.b", account_id: "account-1", company_id: "company-2", conversation_status: "snoozed", snooze_until: "2025-06-01T00:00:00Z" },
  { id: "contact-5", firstName: "Emma", lastName: "Davis", avatar: "", created_at: "2024-01-20T00:00:00Z", updated_at: "2024-01-20T00:00:00Z", user_id: "user-1", userName: "emma.davis", account_id: "account-1", company_id: "company-3", conversation_status: "active" },
  { id: "contact-6", firstName: "Frank", lastName: "Miller", avatar: "", created_at: "2024-01-22T00:00:00Z", updated_at: "2024-01-22T00:00:00Z", user_id: "user-1", userName: "frank.m", account_id: "account-1", company_id: "company-3", conversation_status: "active" },
  { id: "contact-7", firstName: "Grace", lastName: "Wilson", avatar: "", created_at: "2024-01-25T00:00:00Z", updated_at: "2024-01-25T00:00:00Z", user_id: "user-1", userName: "grace.wilson", account_id: "account-1", company_id: "company-4", conversation_status: "active" },
  { id: "contact-8", firstName: "Henry", lastName: "Taylor", avatar: "", created_at: "2024-01-28T00:00:00Z", updated_at: "2024-01-28T00:00:00Z", user_id: "user-1", userName: "henry.t", account_id: "account-1", company_id: "company-4", conversation_status: "closed" },
];

// Messages helper
const makeMsg = (id: string, cid: string, coId: string, name: string, email: string, phone: string, subject: string, text: string, sender: string, ts: string): MessageData => ({
  id, text, created_at: ts, updated_at: ts, platform: "email", subject,
  sender, receiver: sender === "user" ? "contact" : "user",
  user_id: "user-1", contact_id: cid, account_id: "account-1", email, name, phone, company_id: coId,
});

export const mockMessages: Record<string, MessageData[]> = {
  "contact-1": [
    makeMsg("msg-1-1","contact-1","company-1","Alice Johnson","alice@acme.com","+15551000001","Follow-up: Enterprise Plan","<p>Hi Alice, wanted to follow up on the enterprise plan. Still interested?</p>","user","2024-03-01T09:00:00Z"),
    makeMsg("msg-1-2","contact-1","company-1","Alice Johnson","alice@acme.com","+15551000001","Re: Follow-up","<p>Yes, board meeting went well. Can we schedule a demo Tuesday?</p>","contact","2024-03-01T11:30:00Z"),
    makeMsg("msg-1-3","contact-1","company-1","Alice Johnson","alice@acme.com","+15551000001","Re: Follow-up","<p>Tuesday works great. Sending a calendar invite now.</p>","user","2024-03-01T14:00:00Z"),
  ],
  "contact-2": [
    makeMsg("msg-2-1","contact-2","company-1","Bob Smith","bob@acme.com","+15551000002","Outreach workflow","<p>Bob, thanks for connecting. EasyIn can help your outreach workflow.</p>","user","2024-03-05T10:00:00Z"),
    makeMsg("msg-2-2","contact-2","company-1","Bob Smith","bob@acme.com","+15551000002","Re: Outreach","<p>Sounds interesting! We are evaluating tools. Send me a one-pager?</p>","contact","2024-03-06T09:15:00Z"),
  ],
  "contact-3": [
    makeMsg("msg-3-1","contact-3","company-2","Carol Williams","carol@globex.com","+15551000003","Proposal Review","<p>Hi Carol, have you had a chance to review the proposal?</p>","user","2024-03-10T08:00:00Z"),
  ],
  "contact-4": [
    makeMsg("msg-4-1","contact-4","company-2","David Brown","david@globex.com","+15551000004","Check-in","<p>David, are you still the right person to speak with about sales tools?</p>","user","2024-03-12T11:00:00Z"),
  ],
  "contact-5": [
    makeMsg("msg-5-1","contact-5","company-3","Emma Davis","emma@initech.com","+15551000005","Product Overview","<p>Emma, great meeting you. Sharing our product overview.</p>","user","2024-03-15T15:00:00Z"),
    makeMsg("msg-5-2","contact-5","company-3","Emma Davis","emma@initech.com","+15551000005","Re: Product Overview","<p>Thank you! Shared with my VP. Feedback by end of week.</p>","contact","2024-03-16T10:00:00Z"),
  ],
  "contact-6": [
    makeMsg("msg-6-1","contact-6","company-3","Frank Miller","frank@initech.com","+15551000006","LinkedIn follow-up","<p>Frank, EasyIn can solve the outreach tracking problem you mentioned.</p>","user","2024-03-18T09:00:00Z"),
  ],
  "contact-7": [
    makeMsg("msg-7-1","contact-7","company-4","Grace Wilson","grace@umbrella.com","+15551000007","Quick intro","<p>Hi Grace, noticed you are head of growth at Umbrella. Worth a quick chat?</p>","user","2024-03-20T14:00:00Z"),
    makeMsg("msg-7-2","contact-7","company-4","Grace Wilson","grace@umbrella.com","+15551000007","Re: Quick intro","<p>Appreciate the outreach! Can you send over pricing?</p>","contact","2024-03-21T08:30:00Z"),
  ],
  "contact-8": [
    makeMsg("msg-8-1","contact-8","company-4","Henry Taylor","henry@umbrella.com","+15551000008","Following up","<p>Henry, following up on my previous email. Happy to reconnect later.</p>","user","2024-03-22T10:00:00Z"),
  ],
};

// Response feed

// Conversation records — shown in the record list when 'Conversation' nav item is active
export const mockConvoRecords: MessageData[] = [
  {
    id: 'msg-1-2', text: '<p>Yes, board meeting went well. Can we schedule a demo Tuesday?</p>',
    created_at: '2024-03-01T11:30:00Z', updated_at: '2024-03-01T11:30:00Z',
    platform: 'email', subject: 'Re: Follow-up: Enterprise Plan',
    sender: 'contact', sender_name: 'Alice Johnson',
    receiver: 'user', user_id: 'user-1',
    contact_id: 'contact-1', account_id: 'account-1',
    contact_email: 'alice@acme.com',
    User: { id: 'user-1', firstName: 'Sam', lastName: 'Rivera', avatar: '', email: 'sam@easyin.com', account_id: 'account-1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' } as any,
    Contact: mockContacts[0] as any,
  },
  {
    id: 'msg-2-2', text: '<p>Sounds interesting! We are evaluating tools. Send me a one-pager?</p>',
    created_at: '2024-03-06T09:15:00Z', updated_at: '2024-03-06T09:15:00Z',
    platform: 'email', subject: 'Re: Outreach workflow',
    sender: 'contact', sender_name: 'Bob Smith',
    receiver: 'user', user_id: 'user-1',
    contact_id: 'contact-2', account_id: 'account-1',
    contact_email: 'bob@acme.com',
    User: { id: 'user-1', firstName: 'Sam', lastName: 'Rivera', avatar: '', email: 'sam@easyin.com', account_id: 'account-1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' } as any,
    Contact: mockContacts[1] as any,
  },
  {
    id: 'msg-5-2', text: '<p>Thank you! Shared with my VP. Feedback by end of week.</p>',
    created_at: '2024-03-16T10:00:00Z', updated_at: '2024-03-16T10:00:00Z',
    platform: 'email', subject: 'Re: Product Overview',
    sender: 'contact', sender_name: 'Emma Davis',
    receiver: 'user', user_id: 'user-1',
    contact_id: 'contact-5', account_id: 'account-1',
    contact_email: 'emma@initech.com',
    User: { id: 'user-1', firstName: 'Sam', lastName: 'Rivera', avatar: '', email: 'sam@easyin.com', account_id: 'account-1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' } as any,
    Contact: mockContacts[4] as any,
  },
  {
    id: 'msg-7-2', text: '<p>We have budget approved and need to move by end of quarter.</p>',
    created_at: '2024-03-21T16:00:00Z', updated_at: '2024-03-21T16:00:00Z',
    platform: 'email', subject: 'Re: Intro call',
    sender: 'contact', sender_name: 'Grace Wilson',
    receiver: 'user', user_id: 'user-1',
    contact_id: 'contact-7', account_id: 'account-1',
    contact_email: 'grace@umbrella.com',
    User: { id: 'user-1', firstName: 'Sam', lastName: 'Rivera', avatar: '', email: 'sam@easyin.com', account_id: 'account-1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' } as any,
    Contact: mockContacts[6] as any,
  },
];

export const mockResponseMessages = {
  messages: [mockMessages["contact-1"][1], mockMessages["contact-2"][1], mockMessages["contact-5"][1], mockMessages["contact-7"][1]],
};

// Team Members
export const mockTeamMembers: TeamMember[] = [
  { id: "user-1", first_name: "Sam", last_name: "Rivera", name: "Sam Rivera", email: "sam.rivera@easyIn.com" },
  { id: "user-2", first_name: "Jordan", last_name: "Lee", name: "Jordan Lee", email: "jordan.lee@easyIn.com" },
  { id: "user-3", first_name: "Taylor", last_name: "Morgan", name: "Taylor Morgan", email: "taylor.morgan@easyIn.com" },
  { id: "user-4", first_name: "Casey", last_name: "Park", name: "Casey Park", email: "casey.park@easyIn.com" },
];

// Billing
export const mockBilling: BillingData = {
  plan: "PAID", subscription_status: "active", seat_count: 3, seat_limit: 5,
  watched_profiles_count: 120, watched_profiles_limit: 500, has_subscription: true,
  cancel_at_period_end: false, current_period_end: "2025-07-01T00:00:00Z", card_last4: "4242", card_brand: "Visa",
};

// Records List (home page)
export const mockRecordsList: RecordsResponse = {
  records: [
    ...mockContacts.map((c) => ({ type: "contact" as const, page: 1, limit: 10, data: c })),
    ...mockCompanies.map((c) => ({ type: "company" as const, page: 1, limit: 10, data: c })),
    ...mockConvoRecords.map((m) => ({ type: "message" as const, page: 1, limit: 10, data: m })),
  ],
  page: 1, limit: 10, total: mockContacts.length + mockCompanies.length + mockConvoRecords.length, hasNext: false,
};

export const mockRecordsAll = {
  items: [
    ...mockContacts.map((c) => ({ id: c.id, type: "contact" })),
    ...mockCompanies.map((c) => ({ id: c.id, type: "company" })),
    ...mockConvoRecords.map((m) => ({ id: m.id, type: "message" })),
  ],
};

// Properties helper
const makeProperty = (id: string, name: string, type: string, textValue: string | null = null, options: {id:string;value:string}[] = [], extra: Partial<Property2> = {}): Property2 => ({
  id, name, type, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  account_id: "account-1", sortOrder: 0, is_active: true, is_default: false, is_required: false,
  lock_type: "ONE_CLICK_UPDATE" as any, source: "manual" as any,
  options: options.map((o, i) => ({ ...o, contactPropertyId: id, sortOrder: i })),
  values: textValue !== null ? [{ id: `${id}-v`, textValue, numberValue: null, dateValue: null, selectOptions: [], jsonValue: null }] : [],
  ...extra,
});

export const mockContactProperties: Property2[] = [
  makeProperty("prop-c-1","Email","CONTACT_EMAILS",null,[],{values:[{id:"prop-c-1-v",textValue:null,numberValue:null,dateValue:null,selectOptions:[],jsonValue:[{id:"email-1",email:"alice.johnson@acmecorp.com",source:"Manual",isPrimary:true}]}]}),
  makeProperty("prop-c-2","Phone","TEXT","+1 555 100 0001"),
  makeProperty("prop-c-3","Job Title","TEXT","VP of Engineering"),
  makeProperty("prop-c-4","LinkedIn","LINK","https://linkedin.com/in/alice-johnson"),
  makeProperty("prop-c-5","Company","TEXT","Acme Corp"),
  makeProperty("prop-c-6","Lead Status","SELECT",null,[{id:"opt-1",value:"New"},{id:"opt-2",value:"Contacted"},{id:"opt-3",value:"Qualified"},{id:"opt-4",value:"Proposal"},{id:"opt-5",value:"Won"},{id:"opt-6",value:"Lost"}],{values:[{id:"prop-c-6-v",textValue:null,numberValue:null,dateValue:null,selectOptions:[{id:"opt-2",value:"Contacted",contactPropertyId:"prop-c-6",sortOrder:0}],jsonValue:null}]}),
  makeProperty("prop-c-7","Notes","LONG_TEXT","Met at SaaStr 2024. Very interested in enterprise features."),
  makeProperty("prop-c-8","Last Contacted","DATE",null,[],{values:[{id:"prop-c-8-v",textValue:null,numberValue:null,dateValue:"2024-03-01T00:00:00Z",selectOptions:[],jsonValue:null}]}),
];

export const mockCompanyProperties: Property2[] = [
  makeProperty("prop-co-1","Website","LINK","https://acmecorp.com"),
  makeProperty("prop-co-2","Industry","SELECT",null,[{id:"ind-1",value:"Technology"},{id:"ind-2",value:"Finance"},{id:"ind-3",value:"Healthcare"},{id:"ind-4",value:"Manufacturing"}],{values:[{id:"prop-co-2-v",textValue:null,numberValue:null,dateValue:null,selectOptions:[{id:"ind-1",value:"Technology",contactPropertyId:"prop-co-2",sortOrder:0}],jsonValue:null}]}),
  makeProperty("prop-co-3","Employee Count","COMPANY_EMPLOYEE_COUNT","50-200"),
  makeProperty("prop-co-4","HQ Location","TEXT","San Francisco, CA"),
  makeProperty("prop-co-5","Founded","DATE",null,[],{values:[{id:"prop-co-5-v",textValue:null,numberValue:null,dateValue:"2015-03-01T00:00:00Z",selectOptions:[],jsonValue:null}]}),
];

export const mockAccountProperties: Property2[] = [
  makeProperty("prop-a-1","Sender Name","TEXT","Sam Rivera"),
  makeProperty("prop-a-2","Sender Email","ACCOUNT_SENDER_EMAIL","sam.rivera@easyIn.com"),
  makeProperty("prop-a-3","Domain","DOMAIN","easyIn.com"),
  makeProperty("prop-a-4","Timezone","SELECT",null,[{id:"tz-1",value:"UTC"},{id:"tz-2",value:"America/New_York"},{id:"tz-3",value:"America/Los_Angeles"},{id:"tz-4",value:"Europe/London"}],{values:[{id:"prop-a-4-v",textValue:null,numberValue:null,dateValue:null,selectOptions:[{id:"tz-2",value:"America/New_York",contactPropertyId:"prop-a-4",sortOrder:0}],jsonValue:null}]}),
];

export const mockTeamProperties: Property2[] = [
  makeProperty("prop-t-1","Role","SELECT",null,[{id:"role-1",value:"Admin"},{id:"role-2",value:"Member"},{id:"role-3",value:"Viewer"}],{values:[{id:"prop-t-1-v",textValue:null,numberValue:null,dateValue:null,selectOptions:[{id:"role-1",value:"Admin",contactPropertyId:"prop-t-1",sortOrder:0}],jsonValue:null}]}),
  makeProperty("prop-t-2","Department","TEXT","Sales"),
  makeProperty("prop-t-3","LinkedIn","LINK","https://linkedin.com/in/sam-rivera"),
];

// Associations
export const mockContactAssociations: Record<string, CompanyData[]> = {
  "contact-1": [mockCompanies[0]], "contact-2": [mockCompanies[0]],
  "contact-3": [mockCompanies[1]], "contact-4": [mockCompanies[1]],
  "contact-5": [mockCompanies[2]], "contact-6": [mockCompanies[2]],
  "contact-7": [mockCompanies[3]], "contact-8": [mockCompanies[3]],
};

export const mockCompanyAssociations: Record<string, ContactData[]> = {
  "company-1": [mockContacts[0], mockContacts[1]],
  "company-2": [mockContacts[2], mockContacts[3]],
  "company-3": [mockContacts[4], mockContacts[5]],
  "company-4": [mockContacts[6], mockContacts[7]],
};

// Domain
export const mockDomain = { id: "domain-1", domain: "easyIn.com", isVerified: true };
