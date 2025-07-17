import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import createInstance from '../../axios/Interceptor';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useUserStore from '../../store/useUserStore';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRef } from 'react';
import Loading from './Loading';

//로그인 페이지
export default function Login(){
    //스토리지에 저장한 데이터 추출하기
    const {isLogined, setLoginMember, setLoginOrg} = useUserStore();

    useEffect(function(){
        if(!isLogined){ //외부에서 강제 로그아웃 시킨 경우
            setLoginMember(null);
            setLoginOrg(null);
        }
    }, []);

    //선택한 라디오 버튼 value값을 저장할 변수
    const [selectRadio, setSelectRadio] = useState("member");

    function chgRadio(e){
        setSelectRadio(e.target.value);
        setMember({memberId : "", memberPw : ""});
        setOrg({orgId : "", orgPw : ""});
    }

    //개인 회원 선택 시 저장할 State 변수
    const [member, setMember] = useState({
        memberId : "", memberPw : ""
    });

    //단체 회원 선택 시 저장할 State 변수
    const [org, setOrg] = useState({
        orgId : "", orgPw : ""
    });

    return (
        <section className="section login-wrap">
            <div className="page-title"><h1>로그인</h1></div>
            <div className="login-div">
                <div>
                    <FormControl>
                        <RadioGroup row defaultValue="member" name="login-radio" onChange={chgRadio}>
                            <FormControlLabel value="member" control={<Radio />} label="개인 회원" />
                            <FormControlLabel value="org" control={<Radio />} label="단체 회원" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <DoLogin selectRadio={selectRadio} member={member} setMember={setMember} org={org} setOrg={setOrg}/>
                </div>
                <div style={{marginTop : "10px"}}>
                    <Link to="/search/id">아이디 찾기</Link>
                     &nbsp;|&nbsp; <Link to="/search/pw">비밀번호 찾기</Link>
                      &nbsp;|&nbsp; <Link to="/join">회원가입</Link>
                </div>
            </div>
        </section>
    )
}

function DoLogin(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const selectRadio = props.selectRadio;
    const member = props.member;
    const setMember = props.setMember;
    const org = props.org;
    const setOrg = props.setOrg;

    const {setIsLogined, setLoginMember, setLoginOrg, setAccessToken, setRefreshToken} = useUserStore();
    
    //개인 회원 선택 시 input 태그 onChange 함수
    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    //단체 회원 선택 시 input 태그 onChange 함수
    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
    }

    const idRef = useRef(null);
    const pwRef = useRef(null);

    //로그인 버튼 클릭 시 호출 함수
    function login(){
        if(selectRadio == "member"){ //개인 회원 선택
            if(member.memberId == ""){
                Swal.fire({
                    title : "알림",
                    text : "아이디를 입력하세요",
                    icon : "warning",
                    confirmButtonText : "확인",
                    didClose : idRef.current.focus()
                });
            }else if(member.memberPw == ""){
                Swal.fire({
                    title : "알림",
                    text : "비밀번호를 입력하세요",
                    icon : "warning",
                    confirmButtonText : "확인",
                    didClose : pwRef.current.focus()
                });
            }else{
                let options = {};
                options.url = serverUrl + "/member/login";
                options.method = "post";
                options.data = member;
        
                axiosInstance(options)
                .then(function(res){
                    //res.data.resData == LoginMember
                    //res.data.resData.member == Member
                    //res.data.resData.accessToken == 요청 시마다 헤더에 포함시킬 토큰
                    //res.data.resData.refreshToken == accessToken 만료 시 재발급 요청할 때 포함할 토큰
                    if(res.data.resData == null){
                        Swal.fire({
                            title : "알림",
                            text : res.data.clientMsg,
                            icon : res.data.alertIcon,
                            confirmButtonText : "확인"
                        });
                    }else{
                        const loginMember = res.data.resData; //LoginMember 객체

                        //정상 로그인 (스토리지 데이터 변경)
                        setIsLogined(true);
                        setLoginMember(loginMember.member);
                        //스토리지에 토큰 저장
                        setAccessToken(loginMember.accessToken);
                        setRefreshToken(loginMember.refreshToken);

                        //Main 컴포넌트로 전환
                        navigate("/");
                    }
                });
            }
        }else{ //단체 회원 선택
            if(org.orgId == ""){
                Swal.fire({
                    title : "알림",
                    text : "아이디를 입력하세요",
                    icon : "warning",
                    confirmButtonText : "확인",
                    didClose : idRef.current.focus()
                });
            }else if(org.orgPw == ""){
                Swal.fire({
                    title : "알림",
                    text : "비밀번호를 입력하세요",
                    icon : "warning",
                    confirmButtonText : "확인",
                    didClose : pwRef.current.focus()
                });
            }else{
                let options = {};
                options.url = serverUrl + "/org/login";
                options.method = "post";
                options.data = org;
        
                axiosInstance(options)
                .then(function(res){
                    if(res.data.resData == null){
                        Swal.fire({
                            title : "알림",
                            text : res.data.clientMsg,
                            icon : res.data.alertIcon,
                            confirmButtonText : "확인"
                        });
                    }else{
                        const loginOrg = res.data.resData; //LoginOrg 객체

                        setIsLogined(true);
                        setLoginOrg(loginOrg.org);

                        setAccessToken(loginOrg.accessToken);
                        setRefreshToken(loginOrg.refreshToken);

                        //Main 컴포넌트로 전환
                        navigate("/");
                    }
                });
            }
        }
    }

    return (
        <form autoComplete="off" onSubmit={function(e){
            e.preventDefault(); //기본 이벤트 제어
            login(); //로그인 버튼 클릭시 실행 함수
        }}>
            <table className="tbl-login">
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor={selectRadio == "member" ? "memberId" : "orgId"} className="login-label">아이디</label>
                        </th>
                        <td>
                            <TextField type="text" id={selectRadio == "member" ? "memberId" : "orgId"} 
                                   value={selectRadio == "member" ? member.memberId : org.orgId}
                                   onChange={selectRadio == "member" ? chgMember : chgOrg}
                                   className="input-login" style={{marginBottom : "5px"}} inputRef={idRef}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor={selectRadio == "member" ? "memberPw" : "orgPw"} className="login-label">비밀번호</label>
                        </th>
                        <td>
                            <TextField type="password" id={selectRadio == "member" ? "memberPw" : "orgPw"} inputRef={pwRef}
                                   value={selectRadio == "member" ? member.memberPw : org.orgPw} 
                                   onChange={selectRadio == "member" ? chgMember : chgOrg} className="input-login"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <Button variant="contained" type="submit" style={{height : "80px", width : "90px"}}>로그인</Button>
        </form>
    )
}