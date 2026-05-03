import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";

interface ClickTooltipProps {
  children: React.ReactNode;
  propertyId: string;
}

export const ClickTooltip = ({ children, propertyId }: ClickTooltipProps) => {
  const openTooltip = useRightMenuNavigationStore((state) => state.openTooltip);

  const handleClick = () => {
    openTooltip(propertyId, "click");
  };

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        aria-label="Open tooltip"
        className="absolute top-0 bottom-0 left-[39px] right-[35px] z-[10] cursor-default bg-transparent pointer-events-auto"
        onClick={handleClick}
      />
    </div>
  );
};
