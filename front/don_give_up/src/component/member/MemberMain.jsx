import { Route, Routes } from 'react-router-dom';
import './member.css';
import Sidebar from '../common/Sidebar';
import { useState } from 'react';
import MemberUpdate from './MemberUpdate';
import MemberChangePw from './MemberChangePw';
import LikeOrgList from './LikeOrgList';
import DonateList from './DonateList';
import NewsList from './NewsList';
import LeftMenu from '../common/LeftMenu';

//회원 메인 페이지
export default function MemberMain(){

    //사이드메뉴 state변수
    //submenuList == 메뉴의 서브메뉴
    const [menuList, setMenuList] = useState([
        {url: '/member', name: 'MY홈' },
        {url: '/member/news', name: '내 소식' },
        {url: '/member/update', name: '내 정보', submenuList: [{url: '/member/update' , name: '회원정보 수정'}, {url: '/member/changePw' , name: '비밀번호 변경'}, 
         ]},
        {url: '/member/donateList', name: '기부내역조회' },
        {url: '/member/likeOrgList', name: '관심단체' },
        {url: '/member/money/charge', name: '예치금 충전/출금', submenuList: [{url: '/member/money/charge' , name: '예치금 충전'}, {url: '/member/money/chargeHistory' , name: '예치금 충전내역'}, 
                                                                          {url: '/member/money/refund' , name: '예치금 출금'}, {url: '/member/money/refundHistory' , name: '예치금 출금내역'} 
        ]},
        {url: '/member/delete', name: '탈퇴하기'}
    ])

    return (
        <div className='member-main-wrap'>
            <Sidebar menuList = {menuList} />
            <div className='member-main-mid-wrap'>
                <Routes>
                    <Route path='update' element={<MemberUpdate />} /> 
                    <Route path='changePw' element={<MemberChangePw/>} />
                    <Route path='likeOrgList' element={<LikeOrgList />} />
                    <Route path='donateList' element={<DonateList />} />
                    <Route path='news' element={<NewsList />} />
                </Routes>
            </div>
        </div>
    )
}