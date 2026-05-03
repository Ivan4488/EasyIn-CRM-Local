/**
 * Mock axios client - replaces real API calls with mock data.
 * Components call this exactly as before; it returns mock data synchronously.
 */
import {
  mockAccounts, mockActiveAccount, mockContacts, mockCompanies,
  mockMessages, mockResponseMessages, mockTeamMembers, mockBilling,
  mockRecordsList, mockRecordsAll, mockContactProperties, mockCompanyProperties,
  mockAccountProperties, mockTeamProperties, mockContactAssociations,
  mockCompanyAssociations, mockDomain,
} from "~/data/mockData";

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

// Returns a fake axios-style response: { data: T }
const ok = <T>(data: T) => Promise.resolve({ data, status: 200, statusText: "OK", headers: {}, config: {} as any });

const get = <T = any>(url: string): Promise<{ data: T }> => {
  // Records list - home page — filter by activeItems exactly like the real backend
  if (url.startsWith('/records/list')) {
    const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
    const filterParam = params.get('filter') ?? '';
    const filters = filterParam ? filterParam.split(',').map((f: string) => f.trim()).filter(Boolean) : [];

    const allContactRecords = mockContacts.map((c) => ({ type: 'contact' as const, page: 1, limit: 10, data: c }));
    const allCompanyRecords = mockCompanies.map((c) => ({ type: 'company' as const, page: 1, limit: 10, data: c }));
    let records: any[] = [...allContactRecords, ...allCompanyRecords];

    if (filters.length > 0) {
      const wantsContact = filters.includes('contact');
      const wantsCompany = filters.includes('company');
      if (wantsContact || wantsCompany) {
        records = records.filter((r: any) =>
          (wantsContact && r.type === 'contact') ||
          (wantsCompany && r.type === 'company')
        );
      }
    }

    const pg = parseInt(params.get('page') ?? '1', 10);
    const lim = parseInt(params.get('limit') ?? '10', 10);
    const start = (pg - 1) * lim;
    const paged = records.slice(start, start + lim);

    return ok({ records: paged, page: pg, limit: lim, total: records.length, hasNext: start + lim < records.length } as any);
  }
  if (url === '/records/all') return ok(mockRecordsAll as any);

  // Accounts
  if (url === "/accounts/active") return ok(mockActiveAccount as any);
  if (url === "/accounts") return ok(mockAccounts as any);
  if (/^\/accounts\/[^/]+$/.test(url) && !url.includes("/properties") && !url.includes("/domain")) {
    const id = url.split("/")[2];
    return ok((mockAccounts.find((a) => a.id === id) ?? mockActiveAccount) as any);
  }

  // Domain
  if (url.includes("/domain")) return ok(mockDomain as any);

  // Contacts
  if (url === "/contacts/all") return ok(mockContacts as any);
  if (/^\/contacts\/[^/]+$/.test(url) && !url.includes("/properties")) {
    const id = url.split("/").pop();
    return ok((mockContacts.find((c) => c.id === id) ?? mockContacts[0]) as any);
  }
  if (url.startsWith("/contacts/find/")) {
    const id = url.split("/").pop();
    return ok((mockContacts.find((c) => c.id === id) ?? mockContacts[0]) as any);
  }
  if (/^\/contacts\/[^/]+\/properties/.test(url)) return ok(mockContactProperties as any);
  if (url === "/contacts/duplicate-reviews") return ok({ reviews: [] } as any);

  // Companies
  if (url === "/companies/all") return ok(mockCompanies as any);
  if (/^\/companies\/[^/]+$/.test(url) && !url.includes("/properties")) {
    const id = url.split("/").pop();
    return ok((mockCompanies.find((c) => c.id === id) ?? mockCompanies[0]) as any);
  }
  if (/^\/companies\/[^/]+\/properties/.test(url)) return ok(mockCompanyProperties as any);
  if (url === "/companies/duplicate-reviews") return ok({ reviews: [] } as any);

  // Messages
  if (url.startsWith("/messages/") && url.includes("contactId")) {
    const match = url.match(/contactId=([^&]+)/);
    const cid = match ? match[1] : "contact-1";
    return ok((mockMessages[cid] ?? []) as any);
  }
  if (url.startsWith("/messages/requiresResponse")) return ok(mockResponseMessages as any);
  if (url.startsWith("/messages/contact/")) {
    const parts = url.split("/");
    const cid = parts[3] ?? parts[2];
    return ok((mockMessages[cid] ?? []) as any);
  }

  // Team
  if (url === "/users/team") return ok(mockTeamMembers as any);
  if (/^\/users\/[^/]+$/.test(url) && !url.includes("/properties")) {
    const id = url.split("/").pop();
    return ok((mockTeamMembers.find((u) => u.id === id) ?? mockTeamMembers[0]) as any);
  }
  if (/^\/users\/[^/]+\/properties/.test(url)) return ok(mockTeamProperties as any);
  if (url === "/users/properties/schema") return ok(mockTeamProperties as any);

  // Account properties
  if (/^\/accounts\/[^/]+\/properties/.test(url)) return ok(mockAccountProperties as any);

  // Billing
  if (url === "/billing") return ok(mockBilling as any);

  // Associations
  if (/^\/associations\/contact\/[^/]+\/companies/.test(url)) {
    const id = url.split("/")[3];
    return ok((mockContactAssociations[id] ?? []) as any);
  }
  if (/^\/associations\/company\/[^/]+\/contacts/.test(url)) {
    const id = url.split("/")[3];
    return ok((mockCompanyAssociations[id] ?? []) as any);
  }

  // Sender email check / account checks
  if (url.includes("/sender-email") || url.includes("is-email-property-set")) return ok({ isSet: true, isDomainVerified: true } as any);

  // Property history
  if (url.includes("/property-history")) return ok({ property: null, history: [] } as any);

  console.warn("[mock] Unhandled GET:", url);
  return ok(null as any);
};

// All mutations are no-ops that resolve immediately
const post = (_url: string, _data?: any) => ok({ success: true });
const put = (_url: string, _data?: any) => ok({ success: true });
const patch = (_url: string, _data?: any) => ok({ success: true });
const del = (_url: string, _data?: any) => ok({ success: true });

export const axiosClient = { get, post, put, patch, delete: del } as any;
