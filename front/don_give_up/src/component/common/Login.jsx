import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import createInstance from '../../axios/Interceptor';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useUserStore from '../../store/useUserStore';
import { useEffect } from 'react';

//로그인 페이지
export default function Login(){
    //스토리지에 저장한 데이터 추출하기
    const {isLogined, setLoginMember} = useUserStore();

    useEffect(function(){
        if(!isLogined){ //외부에서 강제 로그아웃 시킨 경우
            setLoginMember(null);
        }
    }, []);

    //선택한 라디오 버튼 value값을 저장할 변수
    const [selectRadio, setSelectRadio] = useState("member");

    function chgRadio(e){
        setSelectRadio(e.target.value);
    }
const navigate = useNavigate();
    return (
        <section className="section login-wrap">
            <div className="page-title">로그인</div>
            <div>
                <FormControl>
                    <RadioGroup row defaultValue="member" name="login-radio" onChange={chgRadio}>
                        <FormControlLabel value="member" control={<Radio />} label="개인 회원" />
                        <FormControlLabel value="org" control={<Radio />} label="단체 회원" />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                {selectRadio == "member"
                 ? <MemberLogin/>
                 : <OrgLogin/>}
            </div>
        </section>
    )
}

function MemberLogin(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    //스토리지에 저장한 데이터 추출하기
    const {isLogined, setIsLogined, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    const [member, setMember] = useState({
        memberId : "", memberPw : ""
    });

    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    function login(){
        if(member.memberId == "" || member.memberPw == ""){
            Swal.fire({
                title : "알림",
                text : "아이디 또는 비밀번호를 입력하세요",
                icon : "warning",
                confirmButtonText : "확인"
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
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }

    return (
        <form autoComplete="off" onSubmit={function(e){
            e.preventDefault();
            login();
        }}>
            <table border={1}>
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor="memberId">아이디</label>
                        </th>
                        <td>
                            <input type="text" id="memberId" value={member.memberId} onChange={chgMember}/>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor="memberPw">비밀번호</label>
                        </th>
                        <td>
                            <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit">로그인</button>
        </form>
    )
}

function OrgLogin(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    //스토리지에 저장한 데이터 추출하기
    const {setIsLogined, setLoginOrg, setAccessToken, setRefreshToken} = useUserStore();

    const [org, setOrg] = useState({
        orgId : "", orgPw : ""
    });

    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
    }

    function login(){
        if(org.orgId == "" || org.orgPw == ""){
            Swal.fire({
                title : "알림",
                text : "아이디 또는 비밀번호를 입력하세요",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else{
            let options = {};
            options.url = serverUrl + "/org/login";
            options.method = "post";
            options.data = org;
    
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
                    const loginOrg = res.data.resData; //LoginMember 객체

                    //정상 로그인 (스토리지 데이터 변경)
                    setIsLogined(true);
                    setLoginOrg(loginOrg.org);
                    //스토리지에 토큰 저장
                    setAccessToken(loginOrg.accessToken);
                    setRefreshToken(loginOrg.refreshToken);

                    //Main 컴포넌트로 전환
                    navigate("/");
                }
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }

    return (
        <form autoComplete="off" onSubmit={function(e){
            e.preventDefault();
            login();
        }}>
            <table border={1}>
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor="orgId">아이디</label>
                        </th>
                        <td>
                            <input type="text" id="orgId" value={org.orgId} onChange={chgOrg}/>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor="orgPw">비밀번호</label>
                        </th>
                        <td>
                            <input type="password" id="orgPw" value={org.orgPw} onChange={chgOrg}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit">로그인</button>
        </form>
    )
}