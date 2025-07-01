import { useState } from 'react'

import { Route, Routes } from "react-router-dom";

import Main from './component/common/Main';
import Header from './component/common/Header';
import Footer from './component/common/Footer';
import MemberMain from './component/member/MemberMain';
import Join from './component/common/Join';
import Login from './component/common/Login';
import MemberJoin from './component/member/MemberJoin';
import OrgJoin from './component/org/OrgJoin';
import JoinCategory from './component/common/JoinCategory';
import BizMain from './component/biz/BizMain';
import NewsMain from './component/news/NewsMain';
import AdminMain from './component/admin/AdminMain';

function App() {
  //각 입력 값 변경 시 저장 변수(서버 전송용)
  const [member, setMember] = useState({
      memberId : "", memberPw : "", memberName : "", memberPhone : "",
      memberBirth : "", memberEmail : "", memberAddr : "", categoryList : []
  });

  return (

    <div className="wrap">
      <Header/>
        <main className="content">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/member/*" element={<MemberMain/>}/>
            <Route path="/join" element={<Join setMember={setMember}/>}/>
            <Route path="/member/join" element={<MemberJoin member={member} setMember={setMember}/>}/>
            <Route path="/org/join" element={<OrgJoin/>}/>
            <Route path="/join/category" element={<JoinCategory member={member} setMember={setMember}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/biz/*' element={<BizMain />} />
            <Route path='/news/*' element={<NewsMain />} />
            <Route path='/admin/*' element={<AdminMain />} />
          </Routes>
        </main>
      <Footer/>
    </div>

  )
}

export default App
