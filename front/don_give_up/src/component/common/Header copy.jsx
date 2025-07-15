import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import * as React from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import DotBadge from "./DotBadge";


//헤더 JSX
export default function Header2(){

    return (
        <header className="header2">
                <div className="header2-top">
                    <HeaderLink/>
                </div>
                <div className="header2-menu">
                    <MainNavi/>
                </div>
        </header>
    )
}

function HeaderLink(){
    const navigate = useNavigate();

    //스토리지에 저장한 데이터 추출하기
    const {isLogined, setIsLogined, loginMember, setLoginMember, loginOrg, setLoginOrg, setAccessToken, setRefreshToken, setUnreadAlarmCount} = useUserStore();

    //로그아웃 Link 클릭 시 동작 함수
    function logout(e){
        //기본 이벤트 제어
        e.preventDefault();
    
        setIsLogined(false);
        setLoginMember(null);
        setLoginOrg(null);
        setAccessToken(null);
        setRefreshToken(null);
        setUnreadAlarmCount(0);
        
        navigate("/login");
    }
    
    return (
        <ul className="header-list2">
            {isLogined
            ?
            <>
                {/*로그인 시 보여질 링크*/}
                <li>
                    {loginMember
                     ? loginMember.memberName
                     : loginOrg.orgName
                    }
                </li>
                <li>
                    {/*알림 아이콘 => 일반 회원들에게만 보임*/}
                    {loginOrg || loginMember.memberLevel == 2
                     ?
                    <DotBadge />
                    : 
                    ""
                    }
                </li>
                <li>
                    <Link to="#" onClick={logout}>로그아웃</Link>
                </li>
            </>
            :
            <>
                {/*비로그인 시 보여질 링크*/}
                <li>
                    <Link to="/login">로그인</Link>
                </li>
                <li>
                    <Link to="/join">회원가입</Link>
                </li>
            </>
            }
        </ul>
    )
}

function MainNavi(){
    const {isLogined, loginMember, loginOrg} = useUserStore();
    const navigate = useNavigate();

    function clickMyPage(e){
        e.preventDefault();

        if(isLogined){ //로그인 상태
            if(loginOrg != null){ //단체 회원 로그인 상태
                navigate("/org");
            }else if(loginMember.memberLevel == 2){ //개인 회원 로그인 상태
                navigate("/member");
            }else{ //관리자 로그인 상태
                navigate("/admin");
            }
        }else{ //비로그인 상태
            Swal.fire({
                title : "알림",
                text : "로그인을 해주세요.",
                icon : "warning",
                confirmButtonText : "확인"
            })
            .then(function(result){
                navigate("/login");
            });
        }
    }

    return (
        <ul className="main-menu">
            <li>
                <Link to="/">Don Give Up!</Link>
            </li>
            <li>
                <Link to="/companyIntroduction">사업 소개</Link>
            </li>
            <li>
                <Link to="/organization/list">후원 단체</Link>
            </li>
            <li>
                <Link to="/biz/list">기부 사업</Link>
            </li>
            <li>
                <Link to="/news/list">소식</Link>
            </li>
            <li className="mypage-menu">
                {/*회원 등급에 따라 마이페이지/관리자페이지로 보여주기*/}
                <Link to="#" onClick={clickMyPage}>마이페이지</Link>
                {/*로그인한 회원에 따라 마이페이지 보여주기*/}
                {!isLogined
                ? /*비로그인일 때 개인 회원 마이페이지 목록 보여주기*/
                <MemberMyPage/>
                : loginOrg
                ?
                <OrgMyPage/>
                : loginMember.memberLevel == 2
                ?
                <MemberMyPage/>
                :
                <AdminMyPage/>
                }
            </li>
        </ul>
    )
}

//개인 회원 마이페이지 목록
function MemberMyPage(){

    return (
        <ul className="sub-menu2">
            <li>
                <Link to="/member/news">내 소식</Link>
            </li>
            <li>
                <Link to="/member/likeOrgList">관심 단체</Link>
            </li>
            <li>
                <Link to="/member/donateList">내 활동</Link>
            </li>
            <li>
                <Link to="/member/update">내 정보</Link>
            </li>
        </ul>
    )
}

//단체 회원 마이페이지 목록
function OrgMyPage(){

    return (
        <ul className="sub-menu2">
            <li>
                <Link to="/org/news">내 소식</Link>
            </li>
            <li>
                <Link to="/org/biz">기부 사업 관리</Link>
            </li>
            <li>
                <Link to="/org/update">내 정보</Link>
            </li>
        </ul>
    )
}

//관리자 페이지 목록
function AdminMyPage(){

    return (
        <ul className="sub-menu">
            <li>
                <Link to="#">개인 회원 관리</Link>
            </li>
            <li>
                <Link to="#">단체 회원 관리</Link>
            </li>
            <li>
                <Link to="#">후원 사업 관리</Link>
            </li>
            <li>
                <Link to="#">환불 신청 관리</Link>
            </li>
            <li>
                <Link to="#">신고 내역 관리</Link>
            </li>
        </ul>
    )
}
