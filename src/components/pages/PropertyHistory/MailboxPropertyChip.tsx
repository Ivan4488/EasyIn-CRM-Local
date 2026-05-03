import { MailboxEntry } from "./utils/getPropertyValues";

interface Props {
  entry: MailboxEntry;
}

export const MailboxPropertyChip = ({ entry }: Props) => {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="text-[11px] text-white/40 leading-none">
        {entry.label}
      </span>
      <div className="px-[8px] py-[4px] border border-solid border-gray-moderate bg-black-moderate rounded-[4px] text-[13px] text-white/75 max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap">
        {entry.value}
      </div>
    </div>
  );
};
