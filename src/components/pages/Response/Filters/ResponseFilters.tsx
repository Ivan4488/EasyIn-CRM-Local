import { useState } from "react";
import { Combobox } from "~/components/UI/Combobox/Combobox";

const filters = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "chat",
    label: "Chat",
  },
  {
    value: "website",
    label: "Website",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
];

export const ResponseFilters = () => {
  const [value, setValue] = useState("all");

  const onChange = (value: string) => {
    setValue(value);
  };

  return <Combobox items={filters} value={value} onChange={onChange} align="end" name="Filters:"/>;
};
