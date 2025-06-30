import { Link } from "react-router-dom";

export default function LeftMenu(props){
    const menuList = props.menuList;
    
    return (
        <div className="side-menu">
            <ul>
                {menuList.map(function(menu, index){
                    return <li key={"menu" + index}>
                                <Link to={menu.url}>
                                    <span>{menu.text}</span>
                                </Link>
                           </li>
                })}
            </ul>
        </div>
    )
}