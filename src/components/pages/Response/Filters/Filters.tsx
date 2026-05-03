import { ConversationStatus } from "~/service/types"
import { ResponseFilters } from "./ResponseFilters";
import { Sort } from "./Sort";

interface Props {
  sortValue: ConversationStatus;
  onSortChange: (value: ConversationStatus) => void;
}

export const Filters = ({sortValue, onSortChange}: Props) => {
  return (
    <div className="flex flex-row justify-between mt-[10px]">
      <Sort
        sortValue={sortValue}
        onSortChange={onSortChange}
      />
      <ResponseFilters />
    </div>
  );
};
