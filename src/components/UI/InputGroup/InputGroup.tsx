interface InputGroupProps {
  children: React.ReactNode;
}

export const InputGroup = ({ children }: InputGroupProps) => {
  return (
    <div className="p-[24px] bg-[rgba(29,30,32,0.60)] rounded-[12px] border border-solid border-gray-moderate flex flex-col gap-[4px]">
      {children}
    </div>
  );
};
