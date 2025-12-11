type MenuItem = {
    id: number;
    url: string;
    label: string;
    type: string;
    children?: MenuItem[];
}

type MenuData = {
    [key: string]: MenuItem;
}

type MenuProps = {
    menuData: MenuData[];
}

export const generateMenu = ({ menuData }: MenuProps) => {
    const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item) => (
            <li key={item.id}>
                <a href={item.url} id={`menu-item-${item.id}`}>
                    {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                    <ul>
                        {renderMenuItems(item?.children)}
                    </ul>
                )}
            </li>
        ));
    };

    const items: MenuItem[] = menuData.flatMap((md) => Object.values(md));
    return <nav><ul>{renderMenuItems(items)}</ul></nav>;
};
