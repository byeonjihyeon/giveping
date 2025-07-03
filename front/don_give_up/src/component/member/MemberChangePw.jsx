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

    //기존 비밀번호 일치여부 저장 변수 (false: 기존 비밀번홓 화면, true: 새비밀번호 입력 JSX 화면 표출)
    const [isAuth, setIsAuth] = useState(false);

    //기존 비밀번호값 입력시, ohChange호출 
    function chgMemberPw(e){
        member[e.target.name] = e.target.value;
        setMember({...member});
    }

    //기존 비밀번호 일치성 여부 체크
    function checkPw(){
        const options = {};
        options.url = serverUrl + "/member/checkPw";
        options.method = 'post'; 
        options.data = member;
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setIsAuth(true);        //재랜더링(새비밀번호창으로 변경)
    
                //기존 비밀번호 일치하는 경우, 새밀번호를 입력받아 member.memberpw 저장을 위해, 초기화
                member.memberPw = '';
                setMember({...member});
                alert('비밀번호 확인완료!')
            }else{
                alert('비밀번호가 일치하지 않습니다.')
            }
        })
    }

    //새 비밀번호 확인값, 입력 저장변수 (서버 전송x)
    const [memberPwRe, setMemberPwRe] = useState('');
    function chgMemberPwRe(e){
            setMemberPwRe(e.target.value);
    }
    
    const navigate = useNavigate();

    //비밀번호 변경하기 버튼 클릭시, 동작함수
    function updatePw(){
        //새 비밀번호 정규표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대소문자, 특수문자, 숫자 6~30글자

        if(!regExp.test(member.memberPw)){
            alert('비밀번호는 영어,숫자,특수문자(!,@,#,$로 이루어진 6~30글자를 입력하세요.');

            return;

        }else if(memberPwRe == '' || memberPwRe != member.memberPw){
            alert('비밀번호가 일치하지 않습니다.');

            return;
        }

        //서버에 비밀번호 변경요청후, 정상 변경시, 재로그인 유도
        let options = {};
        options.url = serverUrl + '/member/updatePw';
        options.method = 'patch';
        options.data = member;

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setIsLogined(false);
                setAccessToken(null);
                setRefreshToken(null);

                navigate('/login');
            }
        })
     }


    return (
      
        <div>
            {!isAuth?
                <>          
                    {/* 현재 비밀번호 입력창 */}
                    <div>        
                        <div>
                            <span>현재비밀번호</span>
                            <input type="password" name='memberPw' value={member.memberPw} onChange={chgMemberPw} />
                            <button type="button" onClick={checkPw}>확인</button>
                        </div>
                    </div>
                </>
           : 
                 <>
           {/* 새 비밀번호 입력창 */}
                    <div>
                            <div>
                                <span>변경할 비밀번호</span>
                                <input type="password" name='memberPw' value={member.memberPw} onChange={chgMemberPw} />
                            </div>
                            <div>
                                <span>비밀번호 확인</span>
                                <input type="password" name='memberRePw' value={memberPwRe} onChange={chgMemberPwRe} />
                                <button onClick={updatePw} type="button">변경</button>
                                <p>비밀번호 일치여부 확인 메시지</p>
                            </div>
                    </div>
                  </>
            }
        </div>
         
          
    )
}