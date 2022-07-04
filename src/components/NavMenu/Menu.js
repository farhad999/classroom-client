import MenuItem from "./MenuItem";

const MenuList = ({items, level=0}) => {
    return items.map((item) =>
        <MenuItem key={item.id} item={item} level={level} />
    );
};

export default MenuList;