interface Props {
  value: string;
}

export const PropertyChip = ({ value }: Props) => {
  return (
    <div className="px-[8px] py-[4px] border border-solid border-gray-moderate bg-black-moderate rounded-[4px] max-w-[160px] text-ellipsis overflow-hidden">
      {value}
    </div>
  );
};
