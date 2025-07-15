import { useState } from 'react'

import { Route, Routes } from "react-router-dom";

import Main from './component/common/Main';
import Header from './component/common/Header';
import Footer from './component/common/Footer';
import MemberMain from './component/member/MemberMain';
import Login from './component/common/Login';
import BizMain from './component/biz/BizMain';
import NewsMain from './component/news/NewsMain';
import AdminMain from './component/admin/AdminMain';
import OrgMain from './component/org/OrgMain';
import Join from './component/join/Join';
import JoinMember from './component/join/JoinMember';
import JoinOrg from './component/join/JoinOrg';
import JoinCategory from './component/join/JoinCategory';
import SearchIdPw from './component/common/SearchIdPw';
import CompanyIntroduction from './component/admin/CompanyIntro';
import Organization from'./component/org/OrgList';
import OrgView from './component/org/OrgView';



function App() {

  //개인 회원 정보 저장 변수(서버 전송용)
  const [member, setMember] = useState({
    memberId : "", memberPw : "", memberName : "", memberPhone : "",
    memberBirth : "", memberEmail : "", memberAddrMain : "", memberAddrDetail : "", categoryList : []
  });

  //단체 회원 정보 저장 변수(서버 전송용)
  const [org, setOrg] = useState({
    orgId : "", orgPw : "", orgName : "", orgBiznum : "", orgPhone : "", orgEmail : "",
    orgAddrMain : "", orgAddrDetail : "", orgIntroduce : "", orgAccount : "", orgAccountBank : "", categoryList : []
  });
  
  return (

    <div className="wrap">
      <Header/>
        <main className="content">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/join" element={<Join setMember={setMember} setOrg={setOrg}/>}/>
            <Route path="/join/member" element={<JoinMember member={member} setMember={setMember}/>}/>
            <Route path="/join/org" element={<JoinOrg org={org} setOrg={setOrg}/>}/>
            <Route path="/join/category" element={<JoinCategory member={member} setMember={setMember} org={org} setOrg={setOrg}/>}/>
            <Route path="/member/*" element={<MemberMain/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/biz/*' element={<BizMain />} />
            <Route path='/news/*' element={<NewsMain />} />
            <Route path='/admin/*' element={<AdminMain />} />
            <Route path="/org/*" element={<OrgMain/>}/>
            <Route path="/search/:type" element={<SearchIdPw/>}/>
            <Route path='/companyIntroduction' element={<CompanyIntroduction/>}/>
            <Route path='/organization/*' element={<Organization/>}/>
          </Routes>
        </main>
      <Footer/>
    </div>

  )
}

export default App
