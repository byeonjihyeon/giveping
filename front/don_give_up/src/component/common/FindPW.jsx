import createInstance from "../../axios/Interceptor";
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

//비밀번호 찾기
export default function FindPW(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    //선택한 라디오 버튼 value값을 저장할 변수
    const [selectRadio, setSelectRadio] = useState("member");

    function chgRadio(e){
        setSelectRadio(e.target.value);
        setMember({memberId : "", memberEmail : ""});
        setOrg({orgId : "", orgEmail : ""});
        setMemberEmailId("");
        setMemberEmailDomain("");
        setOrgEmailId("");
        setOrgEmailDomain("");
    }

    const [member, setMember] = useState({memberId : "", memberEmail : ""});
    const [org, setOrg] = useState({orgId : "", orgEmail : ""});

    const [memberEmailId, setMemberEmailId] = useState("");
    const [memberEmailDomain, setMemberEmailDomain] = useState("");
    const [orgEmailId, setOrgEmailId] = useState("");
    const [orgEmailDomain, setOrgEmailDomain] = useState("");

    //확인 버튼 클릭 시 실행 함수
    function findPw(){
        let options = {};
        if(selectRadio == "member"){
            options.url = serverUrl + "/member/findPw";
            options.data = member;
        }else {
            options.url = serverUrl + "/org/findPw";
            options.data = org;
        }
        options.method = "post";

        axiosInstance(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            }).then(function(result){
                navigate("/login");
            });
        });
    }
    
    return (
        <section className="section find-wrap">
            <div className="page-title">비밀번호 찾기</div>
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
                    findPw(); //확인 버튼 클릭 시 실행 함수
                }}>
                    <DoFindPW selectRadio={selectRadio} member={member} setMember={setMember} org={org} setOrg={setOrg}
                            memberEmailId={memberEmailId} setMemberEmailId={setMemberEmailId} memberEmailDomain={memberEmailDomain} setMemberEmailDomain={setMemberEmailDomain}
                            orgEmailId={orgEmailId} setOrgEmailId={setOrgEmailId} orgEmailDomain={orgEmailDomain} setOrgEmailDomain={setOrgEmailDomain}/>
                    <button type="submit">확인</button>
                </form>
            </div>
            <div>
                <Link to="/login">로그인</Link> | <Link to="/findId">아이디 찾기</Link> | <Link to="/join">회원가입</Link>
            </div>
        </section>
    )
}

function DoFindPW(props){
    const selectRadio = props.selectRadio;
    const member = props.member;
    const setMember = props.setMember;
    const org = props.org;
    const setOrg = props.setOrg;
    const memberEmailId = props.memberEmailId;
    const setMemberEmailId = props.setMemberEmailId;
    const memberEmailDomain = props.memberEmailDomain;
    const setMemberEmailDomain = props.setMemberEmailDomain;
    const orgEmailId = props.orgEmailId;
    const setOrgEmailId = props.setOrgEmailId;
    const orgEmailDomain = props.orgEmailDomain;
    const setOrgEmailDomain = props.setOrgEmailDomain;

    //이메일 도메인 직접 입력 선택 여부
    const [isCustom, setIsCustom] = useState(true);

    //아이디 입력 시 onChange 함수
    function chgId(e){
        if(selectRadio == "member"){
            setMember({...member, memberId : e.target.value});
        }else{
            setOrg({...org, orgId : e.target.value});
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

    return (
        <table border={1}>
            <tbody>
                <tr>
                    <th>아이디</th>
                    <td>
                        <input type="text" id={selectRadio == "member" ? "memberId" : "orgId"}
                            value={selectRadio == "member" ? member.memberId : org.orgId} onChange={chgId}/>
                    </td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>
                        <input type="text" id={selectRadio == "member" ? "memberEmailId" : "orgEmailId"}
                                value={selectRadio == "member" ? memberEmailId : orgEmailId} onChange={chgEmailId}/>@
                        <input type="text" id={selectRadio == "member" ? "memberEmailDomain" : "orgEmailDomain"} readOnly={!isCustom}
                                value={selectRadio == "member" ? memberEmailDomain : orgEmailDomain} onChange={chgEmailDomain}/>
                        <select name="eamilDomain" onChange={selectEmailDomain} value={isCustom ? 'custom' : selectRadio == "member" ? memberEmailDomain : orgEmailDomain}>
                            <option value="custom">직접 입력</option>
                            <option value="naver.com">naver.com</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="kakao.com">kakao.com</option>
                            <option value="nate.com">nate.com</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}