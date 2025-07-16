import { useState } from "react";
import createInstance from "../../axios/Interceptor"
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//회원 비밀번호 변경 페이지
export default function MemberChangePw(){

    const axiosInstance = createInstance();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //비밀번호 정상 변경시, 재로그인 == 로그아웃 처리를 위해 스토리지의 데이터 추출
    const {setIsLogined, setRefreshToken, setAccessToken, loginMember} = useUserStore();

    //아이디, 변경할 비밀번호 저장할 변수(서버 전송용)
    const [member, setMember] = useState({
        memberNo : loginMember.memberNo,
        memberPw : ""
    });

    //기존 비밀번호 일치여부 저장 변수
    const [isAuth, setIsAuth] = useState(false);

    //새비밀번호 유효성 여부 변수 0: 입력x, 1:정규식x, 2:유효성 통과 
    const [isValid, setIsVaild] = useState(0);


    //기존 비밀번호값 입력시, ohChange호출 
    function chgMemberPw(e){
        member[e.target.name] = e.target.value;
        setMember({...member});
    }
    //새 비밀번호
    const [memberNewPw, setMemberNewPw] = useState("");

    function chgMemberNewPw(e){
        setMemberNewPw(e.target.value);
    }
    
    //새 비밀번호 확인값, 입력 저장변수 (서버 전송x)
    const [memberPwRe, setMemberPwRe] = useState('');
    function chgMemberPwRe(e){
        setMemberPwRe(e.target.value);
    }

    //새비밀번호 유효성 검사 메시지
    const [pwMsg, setPwMsg] = useState("");

    //기존 비밀번호 일치성 여부 체크 (on Blur)
    function checkPw(){
        setIsAuth(false); 

        const options = {};
        options.url = serverUrl + "/member/checkPw";
        options.method = 'post'; 
        options.data = member;
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setIsAuth(true);  
            }
        })
    }

    //새비밀번호 유효성 검사 (on Blur) 0: 입력x, 1:정규식x, 2:유효성 통과 
    function checkNewPw(){
        setIsVaild(false);

        //새 비밀번호 정규표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대소문자, 특수문자, 숫자 6~30글자
        
        if(!regExp.test(memberNewPw)){
            setPwMsg('영어,숫자,특수문자(!,@,#,$)로 이루어진 6~30글자를 입력하세요.');
            setIsVaild(1);
            return;
        }
        if(memberNewPw != memberPwRe ){
            setPwMsg('새비밀번호와 비밀번호 확인이 일치하지않습니다.');
            setIsVaild(1);
            return;
        }

        setIsVaild(2);
        setPwMsg("");

    }
    
    const navigate = useNavigate();

    //비밀번호 변경하기 버튼 클릭시, 동작함수
    function updatePw(){
       
        if(member.memberPw.length == 0){
            alert('비밀번호를 입력하세요.');
            return;
        }

        if(!isAuth){
            alert('입력한 현재 비밀번호가 일치하지 않습니다.');
            return;
        }


        if(isAuth == true && isValid == 2){
            //서버에 비밀번호 변경요청후, 정상 변경시, 재로그인 유도
            let options = {};
            options.url = serverUrl + '/member/updatePw';
            options.method = 'patch';
            options.data = {memberNo : loginMember.memberNo, memberPw : memberNewPw};
    
            axiosInstance(options)
            .then(function(res){
                if(res.data.resData){
                    setIsLogined(false);
                    setAccessToken(null);
                    setRefreshToken(null);
    
                    navigate('/login');
                }
            });
        }
     }

    return (
        
        <div className="pwchange-wrap">
            <div className="pwchange-title">
                <span>비밀번호 변경</span>
            </div>
            <div className="pwchange-content"> 
                <span>- 이전에 사용한적 없는 비밀번호가 안전합니다.</span>
                <span>- 다른 아이디/사이트에서 사용한 적 없는 비밀번호</span>
                <span>- 영어 대소문자, 특수문자, 숫자 6~30글자</span>
            </div>
            <div className="pw-input-wrap">        
                <input type="password" name='memberPw' placeholder="현재 비밀번호" value={member.memberPw} onChange={chgMemberPw} onBlur={checkPw} />
            </div>
            <div className="pwRe-wrap">
                <div className="pw-input-wrap">
                    <input type="password" placeholder="새 비밀번호" value={memberNewPw} onChange={chgMemberNewPw}  />
                </div>
                <div className="pw-input-wrap">
                    <input type="password" name='memberRePw' placeholder="새 비밀번호 확인"  value={memberPwRe} onChange={chgMemberPwRe} onBlur={checkNewPw} />
                </div>
                <div className="pwRe-msg">
                    <p className={isValid == 1 ? 'invalid' : ""}> {pwMsg}</p>
                </div>      
            </div>
            <div className="update-pw-btn">
                <button onClick={updatePw} type="button">변경</button>
            </div>
        
        </div>  
    )
}