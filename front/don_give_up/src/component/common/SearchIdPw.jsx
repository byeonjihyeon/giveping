import createInstance from "../../axios/Interceptor";
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRef } from "react";
import Loading from "./Loading";

//아이디/비밀번호 찾기
export default function SearchIdPw(){
    const [isLoading, setIsLoading] = useState(false);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    //아이디 찾기인지 비밀비호 찾기인지 구별할 변수
    const param = useParams();
    const type = param.type;

    useEffect(function(){
        setMember({memberId : "", memberName : "", memberEmail : ""});
        setOrg({orgId : "", orgName : "", orgEmail : ""});
        setMemberEmailId("");
        setMemberEmailDomain("");
        setOrgEmailId("");
        setOrgEmailDomain("");
    }, [type]);

    //선택한 라디오 버튼 value값을 저장할 변수
    const [selectRadio, setSelectRadio] = useState("member");

    function chgRadio(e){
        setSelectRadio(e.target.value);
        setMember({memberId : "", memberName : "", memberEmail : ""});
        setOrg({orgId : "", orgName : "", orgEmail : ""});
        setMemberEmailId("");
        setMemberEmailDomain("");
        setOrgEmailId("");
        setOrgEmailDomain("");
    }

    const [member, setMember] = useState({memberId : "", memberName : "", memberEmail : ""});
    const [org, setOrg] = useState({orgId : "", orgName : "", orgEmail : ""});

    const [memberEmailId, setMemberEmailId] = useState("");
    const [memberEmailDomain, setMemberEmailDomain] = useState("");
    const [orgEmailId, setOrgEmailId] = useState("");
    const [orgEmailDomain, setOrgEmailDomain] = useState("");

   //이메일 도메인 직접 입력 선택 여부
    const [isCustom, setIsCustom] = useState(true);

    //이름, 아이디 입력 시 onChange 함수
    function chgValue(e){
        if(selectRadio == "member"){
            member[e.target.id] = e.target.value;
            setMember({...member});
        }else{
            org[e.target.id] = e.target.value;
            setOrg({...org});
        }
    }

    //이메일 아이디 입력 시 onChange 함수
    function chgEmailId(e){
        if(selectRadio == "member"){
            setMemberEmailId(e.target.value);
        }else {
            setOrgEmailId(e.target.value);
        }
    }

    //이메일 도메인 입력 시 onChange 함수
    function chgEmailDomain(e){
        if(selectRadio == "member"){
            setMemberEmailDomain(e.target.value);
        }else{
            setOrgEmailDomain(e.target.value);
        }
    }

    //이메일 도메인 선택 값 onChange 호출 함수
    function selectEmailDomain(e){
        const emailDomain = e.target.value;

        if (emailDomain === "custom") { //직접 입력 선택 시
            //isCustom을 true로 유지하며 입력창에 빈 값 유지
            setIsCustom(true);
            if(selectRadio == "member"){
                setMemberEmailDomain("");
            }else{
                setOrgEmailDomain("");
            }
        }else{ //특정 도메인 선택 시
            //setIsCustom flase로 변경하여 입력 못하게 설정, 해당 도메인 값 입력
            setIsCustom(false);
            if(selectRadio == "member"){
                setMemberEmailDomain(emailDomain);
            }else{
                setOrgEmailDomain(emailDomain);
            }
        }
    }

    //이메일 아이디, 도메인 입력 시 개인/단체 회원 이메일에 set
    if(selectRadio == "member"){
        useEffect(function(){
            const memberEmail = memberEmailId + "@" + memberEmailDomain;
            setMember({...member, memberEmail : memberEmail});
        }, [memberEmailId, memberEmailDomain]);
    }else{
        useEffect(function(){
            const orgEmail = orgEmailId + "@" + orgEmailDomain;
            setOrg({...org, orgEmail : orgEmail});
        }, [orgEmailId, orgEmailDomain]);
    }

    //유효성 체크 실패 후 focus를 위한 useRef
    const nameRef = useRef(null);
    const idRef = useRef(null);
    const emailIdRef = useRef(null);
    const emailDomainRef = useRef(null);

    //확인 버튼 클릭 시 실행 함수
    function searchIdPw(){
        const validations = [
            {valid: type == "id" && selectRadio == "member" && member.memberName == "", message: "이름을 입력하세요.", inputRef: nameRef},
            {valid: type == "id" && selectRadio == "org" && org.orgName == "", message: "단체명을 입력하세요.", inputRef: nameRef},
            {valid: type == "pw" && selectRadio == "member" && member.memberId == "", message: "아이디를 입력하세요.", inputRef: idRef},
            {valid: type == "pw" && selectRadio == "org" && org.orgId == "", message: "아이디를 입력하세요.", inputRef: idRef},
            {valid: selectRadio == "member" && memberEmailId == "", message: "이메일 아이디를 입력하세요.", inputRef: emailIdRef},
            {valid: selectRadio == "org" && orgEmailId == "", message: "이메일 아이디를 입력하세요.", inputRef: emailIdRef},
            {valid: selectRadio == "member" && memberEmailDomain == "", message: "이메일 주소를 입력하세요.", inputRef: emailDomainRef},
            {valid: selectRadio == "org" && orgEmailDomain == "", message: "이메일 주소를 입력하세요.", inputRef: emailDomainRef}
        ]
        
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
        if(type == "id"){
            if(selectRadio == "member"){
                options.url = serverUrl + "/member/searchId";
                options.data = member;
            }else{
                options.url = serverUrl + "/org/searchId";
                options.data = org;
            }
        }else {
            setIsLoading(true);
            if(selectRadio == "member"){
                options.url = serverUrl + "/member/searchPw";
                options.data = member;
            }else {
                options.url = serverUrl + "/org/searchPw";
                options.data = org;
            }
        }
        options.method = "post";

        axiosInstance(options)
        .then(function(res){
            setIsLoading(false);
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            }).then(function(result){
                if(res.data.alertIcon == "success"){
                    navigate("/login");
                }
            });
        });
    }
    
    return (
        <section className="section login-wrap">
            {isLoading ? <Loading/> : ""}
            <div className="page-title"><h1>{type == "id" ? "아이디 찾기" : "비밀번호 찾기"}</h1></div>
            <div className="search-div">
                <div>
                    <FormControl>
                        <RadioGroup row defaultValue="member" name="login-radio" onChange={chgRadio}>
                            <FormControlLabel value="member" control={<Radio />} label="개인 회원" />
                            <FormControlLabel value="org" control={<Radio />} label="단체 회원" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <form autoComplete="off" onSubmit={function(e){
                        e.preventDefault();
                        searchIdPw(); //확인 버튼 클릭 시 실행 함수
                    }}>
                        <table>
                            <tbody>
                                {type == "id"
                                ?
                                <tr>
                                    <th><label className="login-label">{selectRadio == "member" ? "이름" : "단체명"}</label></th>
                                    <td>
                                        <TextField type="text" id={selectRadio == "member" ? "memberName" : "orgName"} className="input-first" inputRef={nameRef}
                                            value={selectRadio == "member" ? member.memberName : org.orgName} onChange={chgValue} style={{marginBottom : "5px"}}/>
                                    </td>
                                </tr>
                                :
                                <tr>
                                    <th><label className="login-label">아이디</label></th>
                                    <td>
                                        <TextField type="text" id={selectRadio == "member" ? "memberId" : "orgId"} className="input-first" inputRef={idRef}
                                            value={selectRadio == "member" ? member.memberId : org.orgId} onChange={chgValue} style={{marginBottom : "5px"}}/>
                                    </td>
                                </tr>
                                }
                                <tr>
                                    <th><label className="login-label">이메일</label></th>
                                    <td>
                                        <TextField type="text" className="input-email" id={selectRadio == "member" ? "memberEmailId" : "orgEmailId"} inputRef={emailIdRef}
                                                value={selectRadio == "member" ? memberEmailId : orgEmailId} onChange={chgEmailId}/>&nbsp;@&nbsp;
                                        <TextField type="text" className="input-email" id={selectRadio == "member" ? "memberEmailDomain" : "orgEmailDomain"} inputRef={emailDomainRef}
                                                value={selectRadio == "member" ? memberEmailDomain : orgEmailDomain} onChange={chgEmailDomain} readOnly={!isCustom}/>
                                        <Select name="eamilDomain" onChange={selectEmailDomain} style={{marginLeft : "5px", width : "125px"}}
                                        value={isCustom ? 'custom' : selectRadio == "member" ? memberEmailDomain : orgEmailDomain}>
                                            <MenuItem value="custom">직접 입력</MenuItem>
                                            <MenuItem value="naver.com">naver.com</MenuItem>
                                            <MenuItem value="gmail.com">gmail.com</MenuItem>
                                            <MenuItem value="daum.net">daum.net</MenuItem>
                                            <MenuItem value="kakao.com">kakao.com</MenuItem>
                                            <MenuItem value="nate.com">nate.com</MenuItem>
                                        </Select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Button variant="contained" type="submit" style={{height : "80px", width : "90px"}}>확인</Button>
                    </form>
                </div>
                <div style={{marginTop : "10px"}}>
                    <Link to="/login">로그인</Link>
                     &nbsp;|&nbsp; {type == "id" ? <Link to="/search/pw">비밀번호 찾기</Link> : <Link to="/search/id">아이디 찾기</Link>}
                     &nbsp;|&nbsp; <Link to="/join">회원가입</Link>
                </div>
            </div>
        </section>
    )
}
