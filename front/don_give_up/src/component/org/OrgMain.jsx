import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { Route, Routes } from "react-router-dom";
import OrgNewsList from "./OrgNewsList";
import OrgUpdate from "./OrgUpdate";
import OrgChangePw from "./OrgChangePw";
import OrgBiz from "./OrgBiz";
import OrgPost from "./OrgPost";
import OrgDelete from "./OrgDelete";
import OrgData from "./OrgData";
import "./org.css";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";
import OrgProfileUpdate from "./OrgProfileUpdate";

//단체 마이페이지 메인
export default function OrgMain(){

    //사이드 메뉴 State 변수
    const [menuList, setMenuList] = useState([
        {url : "/org", name : "MY홈"},
        {url : "/org/news", name : "내 소식"},
        {url : "/org/update", name : "내 정보", submenuList : [{url : "/org/update", name : "단체정보 수정"}, {url : "/org/changePw", name : "비밀번호 변경"}, {url : "/org/changeProfile", name : "프로필 사진 변경"}]},
        {url : "/org/biz", name : "기부 사업 관리", submenuList : [{url : "/org/biz", name : "기부 사업 보기"}, {url : "/org/post", name : "기부 사업 등록"}, {url : "/org/data", name : "기부 사업 통계"}]},
        {url : "/org/delete", name : "탈퇴하기"}
    ]);

    //자식 컴포넌트에 전달할 회원정보
    const [org, setOrg] = useState({});

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginOrg} = useUserStore();

    useEffect(function(){
        if(loginOrg){
            let options = {};
            options.url = serverUrl + "/org/" + loginOrg.orgNo;
            options.method = "get";
    
            axiosInstance(options)
            .then(function(res){
                setOrg(res.data.resData);
            })
        }
    }, []);

    return (
        <div className="org-main-wrap">
            <Sidebar menuList={menuList} org={org}/>
            <div className="org-main-mid-wrap">
                <Routes>
                    <Route path="news" element={<OrgNewsList/>}/>
                    <Route path="update" element={<OrgUpdate org={org} setOrg={setOrg}/>}/>
                    <Route path="changePw" element={<OrgChangePw/>}/>
                    <Route path="changeProfile" element={<OrgProfileUpdate org={org} setOrg={setOrg}/>}/>
                    <Route path="biz" element={<OrgBiz/>}/>
                    <Route path="post" element={<OrgPost/>}/>
                    <Route path="data" element={<OrgData/>}/>
                    <Route path="delete" element={<OrgDelete/>}/>
                </Routes>
            </div>
        </div>
    )
}