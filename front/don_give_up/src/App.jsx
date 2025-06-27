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

function App() {
 

  return (

    <div className="wrap">
      <Header/>
        <main className="content">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/member/*" element={<MemberMain/>}/>
            <Route path="/join" element={<Join/>}/>
            <Route path="/member/join" element={<MemberJoin/>}/>
            <Route path="/org/join" element={<OrgJoin/>}/>
            <Route path="/join/category" element={<JoinCategory/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </main>
      <Footer/>
    </div>

  )
}

export default App
