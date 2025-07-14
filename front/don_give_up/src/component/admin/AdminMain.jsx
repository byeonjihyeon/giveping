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


//관리자 메인
export default function AdminMain(){

        const [member, setMember] = useState({
            // memberName : memberName
        });
    const [menuList, setMenuList] = useState([
        {url : '/admin/memberManage',         text : "회원 관리"},
        {url : '/admin/orgManage',      text: '단체 관리'},
        {url : '/admin/bizManage' ,         text : '기부 사업 관리'},
        {url : '/admin/refundManage' ,         text : '환불 신청 관리'},
        {url : '/admin/reportManage' ,         text : '신고 내역 관리'},
        {url : '/admin/deleteManage' ,         text : '탈퇴 신청 관리'},
        {url : '/admin/payoutManage' ,         text : '관리자 송금 관리'}

    ]);
   

    return (
        <div className="mypage-wrap">
            <div className="mypage-side">
                <section className="section account-box">
                    <div className="account-info">
                        <span className="material-icons">manage_accounts</span>
                        <span className="member-name">관리자 페이지</span>
                    </div>
                     <div className="refund">
                    </div>
                </section>
                <section className="section">  
                    {/* MemberMain에서 사용했던, 컴포넌트 재사용 (이 때, 좌측에 그려질 메뉴 리스트만 다르게 전달) */}
                    <LeftMenu menuList={menuList} />
                </section>
            </div>
            <div className="mypage-content">
                <section className="section">
                    <Routes>
                        <Route path="memberManage" element={<MemberManage />} />
                        <Route path="orgManage" element={<OrgManage />}/>
                        <Route path="bizManage" element={<BizManage />} />
                        <Route path="refundManage" element={<RefundManage />}  />
                        <Route path="reportManage" element={<ReportManage />}  />
                        <Route path="deleteManage" element={<DeleteManage />}  />
                        <Route path="payoutManage" element={<PayoutManage />}  />
                        <Route path="companyIntroduce" element={<CompanyIntroduction/>}/>
                    </Routes>
                </section>
            </div>
        </div>
    );
}