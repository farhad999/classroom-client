import MenuItem from "./MenuItem";
import {hasAccess} from "../../utils/hasAcces";
import {useSelector} from "react-redux";

const MenuList = ({items, level = 0}) => {

    const {user} = useSelector(state => state.auth);

    return items.map((item) =>
        hasAccess(user, item) &&
        <MenuItem key={item.id} item={item} level={level}/>
    );
};

export default MenuList;