import { Dots } from "~/icons/ui/Dots"
import { Combobox } from "~/components/UI/Combobox/Combobox";

interface HeaderMenuProps {
  onLogOut?: () => void;
}

export const HeaderMenu = ({ onLogOut }: HeaderMenuProps) => {
  const handleMenuChange = (value: string) => {
    switch (value) {
      case "logout":
        onLogOut?.();
        break;
    }
  };

  return (
    <Combobox
      items={[
        {
          value: "logout",
          label: "Log Out",
        },
      ]}
      align="end"
      value="none"
      onChange={handleMenuChange}
      name=""
      trigger={
        <div className="p-[4px] py-[10px] cursor-pointer hover:text-text-strong">
          <Dots className="rotate-90"/>
        </div>
      }
      hoverBg={false}
      noHoverTrigger={true}
    />
  );
};
