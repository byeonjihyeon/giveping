import createInstance from "../../axios/Interceptor";
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
import Swal from "sweetalert2";
import { Link, Links } from "react-router-dom";

//아이디 찾기
export default function FindID(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //선택한 라디오 버튼 value값을 저장할 변수
    const [selectRadio, setSelectRadio] = useState("member");

    function chgRadio(e){
        setSelectRadio(e.target.value);
        setMember({memberName : "", memberPhone : ""});
        setOrg({orgName : "", orgPhone : ""});
    }

    const [member, setMember] = useState({memberName : "", memberPhone : ""});
    const [org, setOrg] = useState({orgName : "", orgPhone : ""});

    //확인 버튼 클릭 시 실행 함수
    function findId(){
        let options = {};
        if(selectRadio == "member"){
            options.url = serverUrl + "/member/findId";
            options.data = member;
        }else{
            options.url = serverUrl + "/org/findId";
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
            });
        });
    }

    return (
        <section className="section find-wrap">
            <div className="page-title">아이디 찾기</div>
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
                    findId(); //확인 버튼 클릭 시 실행 함수
                }}>
                    <DoFindID selectRadio={selectRadio} member={member} setMember={setMember} org={org} setOrg={setOrg}/>
                    <button type="submit">확인</button>
                </form>
            </div>
            <div>
                <Link to="/login">로그인</Link> | <Link to="/findPw">비밀번호 찾기</Link> | <Link to="/join">회원가입</Link>
            </div>
        </section>
    )
}

function DoFindID(props){
    const selectRadio = props.selectRadio;
    const member = props.member;
    const setMember = props.setMember;
    const org = props.org;
    const setOrg = props.setOrg;

    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
    }

    return (
        <table border={1}>
            <tbody>
                <tr>
                    <th>{selectRadio == "member" ? "이름" : "단체명"}</th>
                    <td>
                        <input type="text" id={selectRadio == "member" ? "memberName" : "orgName"}
                                value={selectRadio == "member" ? member.memberName : org.orgName}
                                onChange={selectRadio == "member" ? chgMember : chgOrg}/>
                    </td>
                </tr>
                <tr>
                    <th>전화번호</th>
                    <td>
                        <input type="text" id={selectRadio == "member" ? "memberPhone" : "orgPhone"}
                                value={selectRadio == "member" ? member.memberPhone : org.orgPhone}
                                onChange={selectRadio == "member" ? chgMember : chgOrg}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}