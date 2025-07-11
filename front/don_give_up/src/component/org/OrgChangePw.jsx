import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRef } from "react";

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
    const pwRef = useRef(null);
    const pwReRef = useRef(null);

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
        if(org.orgPw == ""){
            Swal.fire({
                title : "알림",
                text : "비밀번호를 입력하세요.",
                icon : "warning",
                confirmButtonText : "확인",
                didClose : pwRef.current.focus()
            });
            return;
        }

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
                confirmButtonText : "확인",
                didClose : pwRef.current.focus()
            })
            .then(function(result){
                if(res.data.resData){
                    setResult(true);
                }
            });
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
        const validations = [
            {valid : newOrgPw == "", message : "변경할 비밀번호를 입력하세요.", inputRef : pwRef},
            {valid : pwChk == 2, message : "변경할 비밀번호 형식이 올바르지 않습니다.", inputRef : pwRef},
            {valid : pwChk == 5, message : "변경할 비밀번호가 기존 비밀번호와 같습니다.", inputRef : pwRef},
            {valid : newOrgPwRe == "", message : "비밀번호 확인을 입력하세요.", inputRef : pwReRef},
            {valid : pwChk == 3, message : "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.", inputRef : pwReRef}
        ];

        for(let i=0; i<validations.length; i++){
            if(validations[i].valid){
                Swal.fire({
                    title : "알림",
                    text : validations[i].message,
                    icon : "warning",
                    confirmButtonText : "확인",
                    didClose : validations[i].inputRef.current.focus()
                });
                return;
            }
        }

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

    return (
        <div>
            <h2 className="page-title">비밀번호 변경</h2>
            <div className={!result ? "updPw-div" : "updPw-div-plus"}>
                {!result
                ? //현재 비밀번호 입력창
                <form autoComplete="off" onSubmit={function(e){
                    e.preventDefault();
                    checkPw();
                }}>
                    <div style={{display : "flex"}}>
                        <label htmlFor="orgPw" className="label" style={{fontWeight : "bold"}}>현재 비밀번호</label>
                        <TextField type="password" id="orgPw" className="input-login" inputRef={pwRef}
                        value={org.orgPw} onChange={chgOrgPw}/>
                        <Button variant="contained" type="submit" style={{width : "90px", marginLeft : "3px"}}>확인</Button>
                    </div>
                </form>
                : //새 비밀번호 입력창
                <form autoComplete="off" style={{display : "flex"}} onSubmit={function(e){
                    e.preventDefault();
                    updatePw();
                }}>
                    <table>
                        <tbody>
                            <tr>
                                <th><label htmlFor="newOrgPw" className="label" style={{width : "110px"}}>변경할 비밀번호</label></th>
                                <td>
                                    <TextField type="password" id="newOrgPw" className="input-login" value={newOrgPw} onChange={chgNewOrgPw} onBlur={checkNewPw} inputRef={pwRef}/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><p>{pwChk == 2 ? "*영대소문자, 숫자, 특수문자로 이루어진 6~30글자입니다." : ""}</p></td>
                            </tr>
                            <tr>
                                <th><label htmlFor="newOrgPwRe" className="label" style={{width : "110px"}}>비밀번호 확인</label></th>
                                <td>
                                    <TextField type="password" id="newOrgPwRe" className="input-login" value={newOrgPwRe} onChange={chgNewOrgPwRe} onBlur={checkNewPw} inputRef={pwReRef}/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><p>{pwChk == 3 ? "*비밀번호와 일치하지 않습니다." : ""}</p></td>
                            </tr>
                        </tbody>
                    </table>
                    <Button variant="contained" type="submit" style={{height : "90px", width : "90px"}}>변경</Button>
                </form>
                }
            </div>
        </div>
        
    )
}