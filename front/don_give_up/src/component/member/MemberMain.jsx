import { Route, Routes, useParams } from 'react-router-dom';
import './member.css';
import Sidebar from '../common/Sidebar';
import { useEffect, useState } from 'react';
import MemberUpdate from './MemberUpdate';
import MemberChangePw from './MemberChangePw';
import LikeOrgList from './LikeOrgList';
import DonationHistory from './DonationHistory';
import NewsList from './NewsList';
import ProfileUpdate from './ProfileUpdate';
import WalletHistory from './WalletHistory';
import MemberDelete from './MemberDelete';


import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';
import MyHome from './MyHome';
import AccountInfo from './AccountInfo';

//회원 메인 페이지
export default function MemberMain(){

    //사이드메뉴 state변수
    //submenuList == 메뉴의 서브메뉴
    const [menuList, setMenuList] = useState([
        {url: '/member', name: 'MY홈' },
        {url: '/member/news', name: '내 소식' },
        {url: '/member/likeOrgList', name: '관심단체' },
        {url: '/member/donateList', name: '내 활동', submenuList: [{url: '/member/donateList' , name: '기부내역'}, , {url: '/member/money/history' , name: '충전 / 출금내역'}]  },
        {url: '/member/update', name: '내 정보', submenuList: [{url: '/member/update' , name: '회원정보 수정'}, {url: '/member/changePw' , name: '비밀번호 변경'}, 
                                                              {url: '/member/changeProfile' , name: '프로필사진 변경'}, {url: '/member/accountInfo' , name: '출금계좌 조회 / 변경'}]}
    ])

    //자식컴포넌트에 전달할 회원정보
    const [member, setMember] = useState({}); 

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginMember} = useUserStore();
    
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/' + loginMember.memberNo;
        options.method = 'get';
        
        //프로필 이미지
        axiosInstance(options)
        .then(function(res){
            setMember(res.data.resData);
            console.log(res.data.resData);
        })
    },[]);  

    return (
        <div className='member-main-wrap'>
            <Sidebar menuList={menuList} member={member}/>
            <div className='member-main-mid-wrap'>
                <Routes>
                    <Route path='/' element={<MyHome member={member} setMember={setMember}/>}  />
                    <Route path='update' element={<MemberUpdate member={member} setMember={setMember} />} /> 
                    <Route path='changePw' element={<MemberChangePw/>} />
                    <Route path='likeOrgList' element={<LikeOrgList />} />
                    <Route path='donateList' element={<DonationHistory member={member}  />} />
                    <Route path='news' element={<NewsList member={member} />} />
                    <Route path='news/:memberNo' element={<NewsList />} />
                    <Route path='changeProfile' element={<ProfileUpdate member={member} setMember={setMember}/>} />
                    <Route path='delete' element={<MemberDelete member={member} />} />
                    <Route path='money/history' element={<WalletHistory member={member} />} />
                    <Route path='accountInfo' element={<AccountInfo member={member} setMember={setMember} />} />
                </Routes>
            </div>
        </div>
    )
}