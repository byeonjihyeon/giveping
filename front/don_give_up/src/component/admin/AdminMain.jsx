import { useState } from "react";
import LeftMenu from "../common/LeftMenu";
import { Route, Routes } from "react-router-dom";

import MemberManage from './MemberManage.jsx';
import OrgManage from "./OrgManage.jsx";
import BizManage from './BizManage.jsx';
import RefundManage from'./RefundManage.jsx';
import ReportManage from'./ReportManage.jsx';
import DeleteManage from'./DeleteManage.jsx';
import PayoutManage from'./PayoutManage.jsx';
import CompanyIntroduction from "./CompanyIntro.jsx";
import "./admin.css";

import { Link } from "react-router-dom";
import Sidebar from "../common/Sidebar.jsx";


//관리자 메인
export default function AdminMain(){

        const [member, setMember] = useState({
            // memberName : memberName
        });
        
    const [menuList, setMenuList] = useState([
         {url : "/admin"},
        {url : '/admin/memberManage',          name : "회원 관리"},
        {url : '/admin/orgManage',             name : '단체 관리'},
        {url : '/admin/bizManage' ,            name : '기부 사업 관리'},
        {url : '/admin/refundManage' ,         name : '환불 신청 관리'},
        {url : '/admin/reportManage' ,         name : '신고 내역 관리'},
        {url : '/admin/deleteManage' ,         name : '탈퇴 신청 관리'},
        {url : '/admin/payoutManage' ,         name : '관리자 송금 관리'}

    ]);
   

    return (
        <div className="admin-wrap">
              <Sidebar menuList={menuList} member={member}/>
            <div className="admin-content"> 
                <Routes>
                    <Route path='/' element={<MemberManage />}  />
                    <Route path="memberManage" element={<MemberManage />} />
                    <Route path="orgManage" element={<OrgManage />}/>
                    <Route path="bizManage" element={<BizManage />} />
                    <Route path="refundManage" element={<RefundManage />}  />
                    <Route path="reportManage" element={<ReportManage />}  />
                    <Route path="deleteManage" element={<DeleteManage />}  />
                    <Route path="payoutManage" element={<PayoutManage />}  />
                    <Route path="companyIntroduce" element={<CompanyIntroduction/>}/>
                </Routes>
            </div>
        </div>
    );
}