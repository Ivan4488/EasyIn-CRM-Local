import { Combobox } from "~/components/UI/Combobox/Combobox";
import { ConversationStatus } from "~/service/types"

const sortOptions = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "closed",
    label: "Closed",
  },
  {
    value: "snoozed",
    label: "Snoozed",
  },
];

interface Props {
  sortValue: ConversationStatus;
  onSortChange: (value: ConversationStatus) => void;
}

export const Sort = ({ sortValue, onSortChange }: Props) => {
  return (
    <Combobox
      items={sortOptions}
      value={sortValue}
      onChange={onSortChange}
      align="start"
      name="Sort By:"
    />
  );
};
