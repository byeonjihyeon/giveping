import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function Sidebar (props){

    const menuList = props.menuList;
    const member = props.member;
    const org = props.org;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    const {loginMember, loginOrg} = useUserStore();

    const location = useLocation();

    //현재 url위치가 /member인지 확인할 boolen 변수
    const isMyHome = location.pathname === '/member' || location.pathname === '/member/';

/*
   NavLink : Link와 기능 거의 동일, 현재 메뉴 활성화하고자 사용, 속성인 end 사용하면 정확한 url의 위치를 찾아서 활성화해준다.
   미사용시, url 포함하면 활성화처리됨. (Ex) /member/...
*/ 

    return (
        <div className="sidebar-wrap">
            {loginMember?.memberLevel !==1 &&(
            <>
           <div className="profile-wrap">
                <img src={  loginMember
                            ?   //개인 회원 로그인 시
                                member.memberProfile
                                ? serverUrl + "/member/" + member.memberProfile.substring(0,8) + "/" + member.memberProfile
                                : "/images/default_profile.jpg"
                            :   loginOrg
                                ?   //단체 회원 로그인 시
                                    org.orgThumbPath 
                                    ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0,8) + "/" + org.orgThumbPath
                                    : "/images/default_profile.jpg"
                                : "#"
                         }/>
                <p>
                    {loginMember ? member.memberName + " 님"
                    : loginOrg ? org.orgName : ""}
                </p>
                <p>
                    {loginMember ? member.memberEmail
                    : loginOrg ? org.orgEmail : ""}
                </p>   
           </div>
           
           {!isMyHome && loginMember && (//현재 url이 /member가 아닌지?
  
                <div className="profile-wrap-btm">
                    <NavLink to='/member/donateList' end>
                        <span>기부금액</span>
                        <span>{member.totalDonateMoney == null ? 0 : member.totalDonateMoney} 원</span>
                    </NavLink>
                    <div>
                        <span>보유금액</span>
                        <span>{member.totalMoney} 원</span>   
                    </div>
                </div>
           )}
               
           {!isMyHome && loginOrg &&(
                
                <div className="profile-wrap-btm">
                    <div>
                        <span>단체 온도</span>
                        <span>{org.orgTemperature}ºC</span>
                    </div>
                </div>
           )}
           </>
           )}
            
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



