import { MenuItem, MenuItemConfig } from "./MenuItem";
import { MenuSectionCollapsible } from "./MenuSectionCollapsible";

export interface MenuSectionConfig {
  id: string;
  title: string;
  items: MenuItemConfig[];
  defaultActive?: boolean;
}

export const MenuSection = ({
  id,
  title,
  defaultActive,
  items,
}: MenuSectionConfig) => {
  return (
    <MenuSectionCollapsible title={title} id={id} defaultActive={defaultActive}>
      {items.map((item, index) => {
        return <MenuItem key={item.id} {...item} />;
      })}
    </MenuSectionCollapsible>
  );
};
