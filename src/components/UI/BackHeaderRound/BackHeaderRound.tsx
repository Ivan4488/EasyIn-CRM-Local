import { BackButton } from "../Buttons/BackButton";

interface BackHeaderRoundProps {
  title: string;
  onClick: () => void;
  Icon: React.FC;
}

export const BackHeaderRound = ({
  title,
  onClick,
  Icon,
}: BackHeaderRoundProps) => {
  return (
    <div
      className="px-[32px] py-[16px] h-[94px] shrink-0 border-b-gray-moderate border-solid border-b flex justify-between group hover:bg-[#282b2c] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-[16px]">
        <div className="h-[36px] w-[36px] rounded-full border-2 border-solid border-gray-moderate flex justify-center items-center text-text-weak">
          <Icon />
        </div>

        <h1 className="text-display-18 text-white font-bold">
          {title}
        </h1>
      </div>

      <BackButton onClick={onClick} />
    </div>
  );
};
