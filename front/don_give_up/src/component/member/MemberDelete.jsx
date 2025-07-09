import { useNavigate } from "react-router-dom"
import useUserStore from "../../store/useUserStore";
import { useState } from "react";
import createInstance from "../../axios/Interceptor";

export default function MemberDelete(props){
    const mainMember = props.member //MemberMain 부모컴포넌트에서 추출
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    //회원탈퇴후 초기화를 위해 스토리지변수 선언
    const {setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken } = useUserStore();

    //탈퇴 동의여부 state변수
    const [isAgreed, setIsAgreed] = useState(false);

    //회원번호, 비밀번호 state 변수
    const [member, setMember] = useState({
        memberNo: mainMember.memberNo,
        memberPw : ""
    })

    //비밀번호 확인여부 state변수
    const [isAuth, setIsAuth] = useState(false);

    //체크박스 onChange
    function chkAgree(e){
        setIsAgreed(e.target.checked);
    }

    //비밀번호 input onChange
    function chgPw(e){
        member.memberPw = e.target.value;
        setMember({...member});
    }

    //확인(비밀번호)버튼 클릭시, 동작함수
    function chkPw(){
        let options = {};
        options.url = serverUrl + '/member/checkPw';
        options.method = 'post';
        options.data = member;
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setIsAuth(true);
            }else{
                alert('비밀번호 틀렸어여!!!');
            }
        })
    }
    //탈퇴버튼 클릭후, 메인화면으로 이동하기 위한
    const navigate = useNavigate();

    //탈퇴버튼 클릭시 동작함수
    function deleteMember(){
        let options = {};
        options.url = serverUrl + '/member/delete/' + loginMember.memberNo;
        options.method = 'patch'    //회원 탈퇴 여부(0 : 정상, 1 : 탈퇴) -> 회원의 기부 내역을 보존하고자
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                //스토리지 정보 초기화
                setIsLogined(false);
                setLoginMember(null);
                setAccessToken(null);
                setRefreshToken(null);
                
                navigate('/login');
            
            }
        })

    }

    return(
        <div>
            회원탈퇴 페이지~! <br/>
            로직 <br/>
            1. 회원 정보처리,현재 남아있는 금액보여주며 탈퇴동의하는 체크와 비밀번호 받기 <br />
                - 예치금 출금으로 이동하는 링크 만들어줄지? <br />
                - 가지고 잇는 금액이 있어도 걍 탈퇴진행한다면? 
                - 그 돈을 관리자가 출금후 빵원 처리 ?
                - 걍 db에서 바로 0원 처리?
            2. 탈퇴버튼 클릭 활성화되며 탈퇴완료~!(db에는 남아있음)
            <hr /> <br />
            <div>
                어쩌구,,저쩌구,,, 탈퇴하면 정보도 남아있지만 제공못할거고, 돈도 못돌려받을 거임.        
            </div>
            <hr /> <br />
            <div>
                현재 너의 토탈 잔액 : <span>{mainMember.totalMoney} 원</span>
            </div>
            <br />
            <div>
                <input type="checkbox" checked={isAgreed} onChange={chkAgree}/> 동의할게!
            </div>
            <br />
            <div >
                비밀번호 : <input type='password' value={member.memberPw} onChange={chgPw} disabled={isAuth} /> 
                <button type='button' onClick={chkPw} disabled={isAuth}>확인</button>
            </div>
            {
        
            <div>
                <button type="button" onClick={deleteMember} disabled={!isAgreed || !isAuth}>탈퇴고고</button>
            </div>
            
            
            }
        </div>     
    )
}