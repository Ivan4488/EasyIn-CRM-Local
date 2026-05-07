import { ContactData } from "~/service/types";

export const getContactName = (contact: ContactData) => {
  const firstName = contact.firstName;
  const lastName = contact.lastName;

  if (!firstName && !lastName) {
    return "New Contact";
  }

  return `${firstName} ${lastName}`.trim();
};
