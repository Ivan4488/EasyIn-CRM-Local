import React from 'react';
import classNames from 'classnames';
import { Arrow } from '~/icons/ui/Arrow';
import { BulkSelect } from '../UI/BulkSelect/BulkSelect'
import { usePaginationStore } from '~/stores/paginationStore'
import { SelectorKey, useSelectorStore } from '~/stores/select'

interface ListHeaderProps {
  onBulkSelectChange: (isChecked: boolean) => void;
  selectorKey: SelectorKey;
  onSelectAll: () => void;
  limit: number;
  itemName: {
    singular: string;
    plural: string;
  }
}

export const PaginationHeader: React.FC<ListHeaderProps> = ({
  onBulkSelectChange,
  selectorKey,
  onSelectAll,
  limit,
  itemName,
}) => {
  const { page, setPage, total } = usePaginationStore();
  const { isSelectAll, selectedItems, clearSelection } = useSelectorStore();
  const selectedCount = selectedItems[selectorKey].length;
  const isSelectionEmpty = selectedCount === 0;
  const start = (page - 1) * limit + 1;
  const end = page * limit;
  const hasMore = total > end;
  return (
    <div className="min-h-[47px] px-[32px] py-[12px] border-b-gray-moderate border-solid border-b flex flex-row flex-wrap justify-between gap-y-[8px]">
      <div className="mt-[3px]">
        <BulkSelect
          isChecked={isSelectAll[selectorKey]}
          onChange={onBulkSelectChange}
          isSelectionActive={!isSelectionEmpty}
        />
      </div>

      {!isSelectionEmpty && (
        <div className="flex flex-row items-center gap-[12px]">
          <span className="text-display-12 font-bold text-text-moderate">
            {new Intl.PluralRules('en-US').select(selectedCount) === 'one'
              ? `${selectedCount} ${itemName.singular} selected`
              : <><span className="max-[1150px]:hidden">{selectedCount} {itemName.plural} selected</span><span className="hidden max-[1150px]:inline">{selectedCount} selected</span></>}
          </span>
          <button
            className="w-fit flex flex-col group cursor-pointer"
            onClick={selectedCount < total ? onSelectAll : () => clearSelection(selectorKey)}
          >
            <span className="text-display-12 font-bold text-text-weak">
              {selectedCount < total
                ? <><span className="max-[1150px]:hidden">Select all {total} {itemName.plural}</span><span className="hidden max-[1150px]:inline">Select all {total}</span></>
                : <><span className="max-[1150px]:hidden">Clear selection</span><span className="hidden max-[1150px]:inline">Clear</span></>}
            </span>
            <div className="h-[1px] w-full invisible bg-text-moderate group-hover:visible" />
          </button>
        </div>
      )}

      <div className="flex gap-[16px] flex-row items-center text-text-weak">
        <div className={!isSelectionEmpty ? "max-[1150px]:hidden" : ""}>
          {start} - {Math.min(end, total)} of {total}
        </div>

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <Arrow
            className={classNames(
              "-rotate-90",
              page === 1 && "text-gray-3"
            )}
          />
        </button>

        <button
          disabled={!hasMore}
          onClick={() => setPage(page + 1)}
        >
          <Arrow
            className={classNames("rotate-90", !hasMore && "text-gray-3")}
          />
        </button>
      </div>
    </div>
  );
};