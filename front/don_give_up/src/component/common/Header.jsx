import { Link } from "react-router-dom";

//헤더 JSX
export default function Header(){

    return (
        <header className="header">
            <div className="header-wrap">
                <div>
                    <div className="logo">
                        <img src="/images/GivePing.png"/>
                        <Link to="/">Don Give Up!</Link>
                    </div>
                    <HeaderLink/>
                </div>
                <div className="header-menu">
                    <MainNavi/>
                </div>
            </div>
        </header>
    )
}

function HeaderLink(){
    
    return (
        <ul className="header-list">
            <>
                {/*로그인 시 보여질 링크*/}
                <li>이름</li>
                <li>
                    <Link to="#">로그아웃</Link>
                </li>
            </>
            <>
                {/*비로그인 시 보여질 링크*/}
                <li>
                    <Link to="/login">로그인</Link>
                </li>
                <li>
                    <Link to="/join">회원가입</Link>
                </li>
            </>
        </ul>
    )
}

function MainNavi(){

    return (
        <ul className="main-menu">
            <li>
                <Link to="#">사업 소개</Link>
            </li>
            <li>
                <Link to="#">후원 단체</Link>
            </li>
            <li>
                <Link to="#">후원 사업</Link>
            </li>
            <li>
                <Link to="#">소식</Link>
            </li>
            <li className="mypage-menu">
                {/*회원 등급에 따라 마이페이지/관리자페이지로 보여주기*/}
                <Link to="#">마이페이지</Link>
                {/*로그인한 회원에 따라 마이페이지 보여주기*/}
                <OrgMyPage/>
                <MemberMyPage/>
                <AdminMyPage/>
            </li>
        </ul>
    )
}

//개인 회원 마이페이지 목록
function MemberMyPage(){

    return (
        <ul className="sub-menu">
            <li>
                <Link to="#">회원 정보 수정</Link>
            </li>
            <li>
                <Link to="#">기부 내역 조회</Link>
            </li>
            <li>
                <Link to="#">관심 단체</Link>
            </li>
            <li>
                <Link to="#">예치금 충전/환불</Link>
            </li>
            <li>
                <Link to="#">회원 탈퇴</Link>
            </li>
        </ul>
    )
}

//단체 회원 마이페이지 목록
function OrgMyPage(){

    return (
        <ul className="sub-menu">
            <li>
                <Link to="#">회원 정보 수정</Link>
            </li>
            <li>
                <Link to="#">기업 정보 수정</Link>
            </li>
            <li>
                <Link to="#">기부 사업 관리</Link>
            </li>
            <li>
                <Link to="#">회원 탈퇴</Link>
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