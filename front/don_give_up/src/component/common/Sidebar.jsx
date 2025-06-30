import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Sidebar (props){

    const menuList = props.menuList;

    const location = useLocation();

    //현재 url위치가 /member인지 확인할 boolen 변수
    const isMyHome = location.pathname === '/member' || location.pathname === '/member/';

/*
   NavLink : Link와 기능 거의 동일, 현재 메뉴 활성화하고자 사용, 속성인 end 사용하면 정확한 url의 위치를 찾아서 활성화해준다.
   미사용시, url 포함하면 활성화처리됨. (Ex) /member/...
*/ 

    return (
        <div className="sidebar-wrap">
           <div className="profile-wrap">
                <img src="/images/default_profile.jpg"/>
                <p>변초코님</p>
                <p>byeonchoco</p>   
           </div>
           { !isMyHome ? //현재 url이 /member가 아닌지?
            <div className="profile-wrap-btm">
                <NavLink to='/member/donateList' end>
                    <span>기부금액</span>
                    <span>100000 원</span>
                </NavLink>
                <div>
                    <span>보유금액</span>
                    <span>5000 원</span>   
                </div>
            </div>
           :
             ""
            }
           <div className="side-menu-wrap">
                <div className="side-menu">
                    {menuList.map(function(menu, index){
                        return <OneSideMenu key={"menu" + index} menu={menu} />
                    })}
               </div>
           </div>
        </div>
    )
}

//사이드 메뉴 1개 
function OneSideMenu(props) {
    
    const menu = props.menu;

    return (
       <>
        <NavLink to={menu.url} end>{menu.name}</NavLink>
        {
            menu.submenuList ? /* 메뉴의 서브메뉴가 있는지? */
            <div className="side-sub-menu">
                {menu.submenuList.map(function(submenu, index){
                    return <NavLink key={"submenu" + index} to={submenu.url} end>{submenu.name}</NavLink>
                })}
            </div>
            :
            ""
        }
       </>
    )
}

