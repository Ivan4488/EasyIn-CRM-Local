interface Props {
  children: React.ReactNode;
}

export const MiddleCutOut = ({ children }: Props) => {
  return (
    <div
      className="w-[532px] h-full overflow-hidden border border-t-0 border-gray-moderate flex flex-col"
      style={{ background: "rgba(29, 30, 32, 0.20)" }}
    >
      {children}
    </div>
  );
};
