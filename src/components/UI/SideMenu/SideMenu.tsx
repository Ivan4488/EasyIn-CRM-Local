import { SideMenuLayout } from "./SideMenuLayout";
import { MenuSection, MenuSectionConfig } from "./MenuSection";

interface Props {
  config: MenuSectionConfig[];
}

export const SideMenu = ({ config }: Props) => {
  return (
    <SideMenuLayout>
      <div className="flex flex-col gap-[4px]">
        {config.map((item, index) => {
          return <MenuSection key={item.id} {...item} />;
        })}
      </div>
    </SideMenuLayout>
  );
};
