import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//비밀번호 변경(단체)
export default function OrgChangePw(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const {loginOrg, setIsLogined, setLoginOrg} = useUserStore();
    const orgNo = loginOrg.orgNo;

    const [org, setOrg] = useState({orgNo : orgNo, orgPw : ""});
    const [newOrgPw, setNewOrgPw] = useState("");       //새 비밀번호
    const [newOrgPwRe, setNewOrgPwRe] = useState("");   //새 비밀번호 확인
    const [result, setResult] = useState(false);        //비밀번호 확인을 진행해야 새 비밀번호를 입력할 수 있도록 제어할 변수

    //비밀번호 변경 시 호출 함수
    function chgOrgPw(e){
        setOrg({...org, orgPw : e.target.value});
    }
    function chgNewOrgPw(e){
        setNewOrgPw(e.target.value);
    }
    function chgNewOrgPwRe(e){
        setNewOrgPwRe(e.target.value);
    }

    //현재 비밀번호 확인 버튼 클릭 시 실행 함수
    function checkPw(){
        let options = {};
        options.url = serverUrl + "/org/chkPw";
        options.method = "post";
        options.data = org;

        axiosInstance(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            })
            .then(function(result){
                if(res.data.resData){
                    setResult(true);
                }
            })
        });
    }

    /*
    비밀번호 검증 결과 저장 변수
    0 : 검사 이전 상태
    1 : 유효성 체크 통과 && 비밀번호 확인값 일치
    2 : 유효성 체크 실패
    3 : 비밀번호 확인값 불일치
    4 : 유효성 체크 통과 && 비밀번호 확인값 미입력
    5 : 기존 비밀번호와 동일
    */
    const [pwChk, setPwChk] = useState(0);

    function checkNewPw(e){
        //비밀번호 정규표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대소문자, 특수문자, 숫자 6~30글자

        if(e.target.id == "newOrgPw"){ //새 비밀번호 입력
            if(!regExp.test(e.target.value)){
                setPwChk(2); //유효성 체크 실패
            }else if(newOrgPwRe != ""){ //새 비밀번호 확인 입력한 경우
                if(e.target.value == newOrgPwRe){ //새 비밀번호 == 새 비밀번호 확인
                    if(e.target.value == org.orgPw){ //새 비밀번호 == 기존 비밀번호
                        setPwChk(5);
                    }else{
                        setPwChk(1);
                    }
                }else{
                    setPwChk(3);
                }
            }else{ //새 비밀번호 확인 입력 안한 경우
                setPwChk(4);
            }
        }else{ //새 비밀번호 확인 입력
            if(newOrgPw == e.target.value){ //새 비밀번호 == 새 비밀번호 확인
                if(regExp.test(newOrgPw)){
                    if(newOrgPw == org.orgPw){ //새 비밀번호 == 기존 비밀번호
                        setPwChk(5);
                    }else{
                        setPwChk(1);
                    }
                }
            }else{ //새 비밀번호와 불일치
                setPwChk(3);
            }
        }
    }

    //변경 버튼 클릭 시 실행할 함수
    function updatePw(){
        if(!result){ //현재 비밀번호 확인을 하지 않고 클릭했을 때
            Swal.fire({
                title : "알림",
                text : "현재 비밀번호 확인을 진행해주세요.",
                icon : "warning",
                confirmButtonText : "확인"
            })
        }else{ //현재 비밀번호 확인 완료
            if(pwChk != 1){ //유효성 체크 통과 실패
                const validations = [
                    {valid : pwChk == 2, message : "변경할 비밀번호가 올바르지 않습니다."},
                    {valid : pwChk == 3, message : "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다."},
                    {valid : pwChk == 4, message : "비밀번호 확인을 입력하세요."},
                    {valid : pwChk == 5, message : "변경할 비밀번호가 기존 비밀번호와 같습니다."}
                ];

                for(let i=0; i<validations.length; i++){
                    if(validations[i].valid){
                        Swal.fire({
                            title : "알림",
                            text : validations[i].message,
                            icon : "warning",
                            confirmButtonText : "확인"
                        });
                        return;
                    }
                }
            }else{ //유효성 체크 통과
                let options = {};
                options.url = serverUrl + "/org/updPw/" + orgNo + "/" + newOrgPw;
                options.method = "post";

                axiosInstance(options)
                .then(function(res){
                    Swal.fire({
                        title : "알림",
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText : "확인"
                    })
                    .then(function(result){
                        setLoginOrg(null);
                        setIsLogined(false);
                        navigate("/login");
                    });
                });
            }
        }
    }

    return (
        //현재 비밀번호 입력창
        <div>
            {!result
            ?
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                checkPw();
            }}>
                <div>
                    <label htmlFor="orgPw">현재비밀번호</label>
                    <input type="password" id="orgPw" value={org.orgPw} onChange={chgOrgPw}/>
                    <button type="submit">확인</button>
                </div>
            </form>
            ://새 비밀번호 입력창
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                updatePw();
            }}>
                <div>
                    <label htmlFor="newOrgPw">변경할 비밀번호</label>
                    <input type="password" id="newOrgPw" value={newOrgPw} onChange={chgNewOrgPw} onBlur={checkNewPw} readOnly={result ? false : true}/>
                    <p>{pwChk == 2 ? "비밀번호는 영대소문자, 숫자, 특수문자로 이루어진 6~30글자입니다." : ""}</p>
                </div>
                <div>
                    <label htmlFor="newOrgPwRe">비밀번호 확인</label>
                    <input type="password" id="newOrgPwRe" value={newOrgPwRe} onChange={chgNewOrgPwRe} onBlur={checkNewPw} readOnly={result ? false : true}/>
                    <button type="submit">변경</button>
                    <p>{pwChk == 3 ? "비밀번호와 일치하지 않습니다." : ""}</p>
                </div>
            </form>
            }
        </div>
        
    )
}