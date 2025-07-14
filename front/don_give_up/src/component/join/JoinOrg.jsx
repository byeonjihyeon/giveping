import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

//단체 회원 회원가입 페이지
export default function JoinOrg(props){
    const navigate = useNavigate();

    const org = props.org;
    const setOrg = props.setOrg;

    //아이디, 비밀번호, 단체명, 사업자번호, 전화번호, 단체 설명, 계좌번호 onChange 호출 함수
    function chgOrg(e){
        
        if(e.target.id == "orgIntroduce" && e.target.value.length <= 150){
            setOrg({...org, orgIntroduce : e.target.value});
            setKeyUp(e.target.value.length);
        }else if(e.target.id != "orgIntroduce") {
            org[e.target.id] = e.target.value;
            setOrg({...org});
        }
    }

    /*아이디 관련 코드*/
    /*
    아이디 유효성 체크 결과, 중복 체크 결과를 저장할 변수
    0 : 검증 이전 상태
    1 : 회원가입 가능한 상태(유효성 검증, 중복 체크 통과)
    2 : 유효성 체크 실패
    3 : 중복된 아이디가 존재하는 경우 
    */
    const [idChk, setIdChk] = useState(0);


    /*비밀번호 관련 코드*/
    //비밀번호 확인 값 변경 시 저장 변수 (서버 전송 X. 화면에서 처리를 위함)
    const [orgPwRe, setOrgPwRe] = useState("");

    //비밀번호 확인 값 onChange 호출 함수
    function chgOrgPwRe(e){
        setOrgPwRe(e.target.value);
    }

    /*
    비밀번호 검증 결과 저장 변수
    0 : 검사 이전 상태
    1 : 유효성 체크 통과 && 비밀번호 확인값 일치
    2 : 유효성 체크 실패
    3 : 비밀번호 확인값 불일치
    4 : 유효성 체크 통과 && 비밀번호 확인값 미입력
    */
    const [pwChk, setPwChk] = useState(0);

    function checkOrgPw(e){
        //비밀번호 정규 표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대소문자, 특수문자, 숫자 6~30글자

        if(e.target.id == "orgPw"){ //비밀번호 입력
            if(!regExp.test(e.target.value)){
                //비밀번호 유효성 체크 실패
                setPwChk(2);
            }else if(orgPwRe != ""){ //비밀번호 확인 입력된 경우
                if(e.target.value == orgPwRe){//비밀번호 == 비밀번호 확인
                    setPwChk(1);
                }else{
                    setPwChk(3);
                }
            }else{
                setPwChk(4); //비밀번호 확인값 미입력
            }
        }else { //비밀번호 확인 입력
            if(org.orgPw == e.target.value){//비밀번호 == 비밀번호 확인
                if(regExp.test(org.orgPw)){ //비밀번호 유효성 검증 통과
                    setPwChk(1);
                }
            }else{ //비밀번호와 확인값 불일치
                setPwChk(3);
            }
        }
    }


    /*사업자번호 관련 코드*/
    /*
    사업자번호 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [biznumChk, setBiznumChk] = useState(0);

    //사업자번호 값 onBlur 함수
    function checkOrgBiznum(e){
        //사업자번호 정규표현식
        const regExp = /^\d{3}-\d{2}-\d{5}/; //000-00-00000 형식

        if(!regExp.test(e.target.value)){
            setBiznumChk(2); //유효성 체크 실패
        }else{
            setBiznumChk(1); //유효성 체크 통과
        }
    }


    /*전화번호 관련 코드*/
    /*
    전화번호 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [phoneChk, setPhoneChk] = useState(0);

    //전화번호 값 onBlur 함수
    function checkOrgPhone(e){
        //전환번호 정규표현식
        const regExp = /^\d{2,3}-\d{3,4}-\d{4}/;

        if(!regExp.test(e.target.value)){
            setPhoneChk(2); //유효성 체크 실패
        }else{
            setPhoneChk(1); //유효성 체크 통과
        }
    }


    /*이메일 관련 코드*/
    /*
    이메일 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 아아디, 도메인 모두 유효성 체크 통과
    2 : 아이디 유효성 체크 실패
    3 : 아이디 유효성 체크 통과 도메인 입력 X
    4 : 도메인 유효성 체크 실패
    5 : 도메인 유효성 체크 통과 아이디 입력 X
    */
    const [emailChk, setEmailChk] = useState(0);

    //이메일 값 변경 시 저장 변수
    const [orgEmailId, setOrgEmailId] = useState("");           //이메일 아이디
    const [orgEmailDomain, setOrgEmailDomain] = useState("");   //이메일 도메인


    /*단체 설명 관련 코드*/
    const [keyUp, setKeyUp] = useState(0);


    /*계좌번호 관련 코드*/
    const [bankSelect, setBankSelect] = useState("select");

    //은행 선택 시 State 변수에 저장
    function selectAccountBank(e){
        setBankSelect(e.target.value);
        setOrg({...org, orgAccountBank : e.target.value});
    }

    /*
    계좌번호 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [accountChk, setAccountChk] = useState(0);

    function checkAccount(e){
        const regExp = /^\d{10,14}$/;

        if(!regExp.test(e.target.value)){
            setAccountChk(2);   //유효성 체크 실패
        }else{
            setAccountChk(1);   //유효성 체크 통과
        }
    }

    //input 별 useRef
    const orgIdRef = useRef(null);              //아이디
    const orgPwRef = useRef(null);              //비밀번호
    const orgPwReRef = useRef(null);            //비밀번호 확인
    const orgNameRef = useRef(null);            //단체명
    const orgBiznumRef = useRef(null);          //사업자 번호
    const orgPhoneRef = useRef(null);           //전화번호
    const orgEmailIdRef = useRef(null);         //이메일 아이디
    const orgEmailDomainRef = useRef(null);     //이메일 도메인
    const addressRef = useRef(null);            //주소
    const orgIntroduceRef = useRef(null);       //단체 설명
    const orgAccountBankRef = useRef(null);    //은행
    const orgAccountRef = useRef(null);         //계좌번호

function insertOrg() {
    // 유효성 조건 리스트
    const validations = [
        { valid: org.orgId == "", message: "아이디를 입력하세요.", inputRef : orgIdRef},
        { valid: org.orgId !== "" && idChk !== 1, message: "아이디 중복체크를 하세요.", inputRef : orgIdRef },
        { valid: idChk !== 1, message: "아이디 형식이 올바르지 않습니다.", inputRef : orgIdRef },
        { valid: org.orgPw == "", message: "비밀번호를 입력하세요.", inputRef : orgPwRef },
        { valid: pwChk == 2, message: "비밀번호 형식이 올바르지 않습니다.", inputRef : orgPwRef },
        { valid: orgPwRe === "", message: "비밀번호 확인을 입력하세요.", inputRef : orgPwReRef },
        { valid: pwChk == 3, message: "비밀번호가 일치하지 않습니다.", inputRef : orgPwReRef},
        { valid: org.orgName === "", message: "단체명을 입력하세요.", inputRef : orgNameRef },
        { valid: org.orgBiznum == "", message: "사업자번호를 입력하세요.", inputRef : orgBiznumRef },
        { valid: biznumChk !== 1, message: "사업자번호 형식이 올바르지 않습니다.(XXX-XX-XXXXX) 형식", inputRef : orgBiznumRef },
        { valid: org.orgPhone == "", message: "전화번호를 입력하세요.", inputRef : orgPhoneRef },
        { valid: phoneChk !== 1, message: "전화번호 형식이 올바르지 않습니다.", inputRef : orgPhoneRef },
        { valid: orgEmailId == "" && orgEmailDomain == "", message: "이메일을 입력하세요.", inputRef : orgEmailIdRef},
        { valid: orgEmailDomain != "" && orgEmailId == "", message: "이메일 아이디를 입력하세요.", inputRef : orgEmailIdRef},
        { valid: emailChk == 2, message: "이메일 아이디 형식이 올바르지 않습니다.", inputRef : orgEmailIdRef},
        { valid: orgEmailDomain == "", message: "이메일 주소를 입력하세요.", inputRef : orgEmailDomainRef },
        { valid: emailChk !== 1, message: "이메일 주소 형식이 올바르지 않습니다.", inputRef : orgEmailDomainRef },
        { valid: org.orgAddrMain === "", message: "주소를 입력하세요.", inputRef : addressRef },
        { valid: org.orgIntroduce === "", message: "단체설명을 입력하세요.", inputRef : orgIntroduceRef },
        { valid: keyUp > 150, message: "단체설명은 띄어스기 포함 150자 이하로 작성해주세요.", inputRef : orgIntroduceRef },
        { valid: org.orgAccountBank === "" || org.orgAccountBank === "select", message: "은행을 선택하세요.", inputRef : orgAccountBankRef },
        { valid: org.orgAccount == "", message: "계좌번호를 입력하세요.", inputRef : orgAccountRef },
        { valid: accountChk !== 1, message: "계좌번호 형식이 올바르지 않습니다.", inputRef : orgAccountRef }
    ];

    // 검증 실패 시 첫 번째 오류 메시지 띄우고 return
    for (let i = 0; i < validations.length; i++) {
        if (validations[i].valid) {
            Swal.fire({
                title: "알림",
                text: validations[i].message,
                icon: "warning",
                confirmButtonText: "확인",
                didClose : validations[i].inputRef.current.focus()
            });
            return;
        }
    }

    // 모든 조건 통과 시 페이지 이동
    navigate("/join/category");
}


    return (
        <section className="section join-wrap">
            <div className="page-title"><h1>단체 회원가입</h1></div>
            <div className="join-form">
                <form autoComplete="off" onSubmit={function(e){
                    e.preventDefault(); //기본 submit 이벤트 제어
                    insertOrg();     //다음 버튼 클릭 시 호출 함수
                }}>
                    <table className="tbl-join">
                        <tbody>
                            <tr>
                                <th>
                                    <label htmlFor="orgId" className="label">아이디</label>
                                </th>
                                <td>
                                    <OrgId org={org} chgOrg={chgOrg} idChk={idChk} setIdChk={setIdChk} orgIdRef={orgIdRef}/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <p style={{color : "red"}}>{idChk == 2 ? "*아이디는 영대소문자와 숫자로 이루어진 6~20글자입니다." : ""}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgPw" className="label">비밀번호</label>
                                </th>
                                <td>
                                    <TextField type="password" id="orgPw" className="input-first" inputRef={orgPwRef}
                                    value={org.orgPw} onChange={chgOrg} onBlur={checkOrgPw} placeholder="영대소문자, 숫자, 특수문자로 이루어진 6~30글자"/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <p style={{color : "red"}}>{pwChk == 2 ? "*비밀번호는 영대소문자, 숫자, 특수문자로 이루어진 6~30글자입니다." : ""}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgPwRe" className="label">비밀번호 확인</label>
                                </th>
                                <td>
                                    <TextField type="password" id="orgPwRe" className="input-first" inputRef={orgPwReRef}
                                    value={orgPwRe} onChange={chgOrgPwRe} onBlur={checkOrgPw}/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <p style={{color : "red"}}>{pwChk == 3 ? "*비밀번호와 일치하지 않습니다." : ""}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgName" className="label">단체명</label>
                                </th>
                                <td>
                                    <TextField type="text" id="orgName" className="input-first" inputRef={orgNameRef}
                                    value={org.orgName} onChange={chgOrg}/>
                                </td>
                            </tr>
                            <tr><td></td><td><p></p></td></tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgBiznum" className="label">사업자 번호</label>
                                </th>
                                <td>
                                    <TextField type="text" id="orgBiznum" className="input-first" inputRef={orgBiznumRef}
                                    value={org.orgBiznum} onChange={chgOrg} onBlur={checkOrgBiznum} placeholder="'-'를 포함해서 작성해주세요. (XXX-XX-XXXXX)"/>
                                </td>
                            </tr>
                            <tr><td></td><td><p></p></td></tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgPhone" className="label">전화번호</label>
                                </th>
                                <td>
                                    <TextField type="text" id="orgPhone" className="input-first" inputRef={orgPhoneRef}
                                    value={org.org} onChange={chgOrg} onBlur={checkOrgPhone} placeholder="'-'를 포함해서 작성해주세요."/>
                                </td>
                            </tr>
                            <tr><td></td><td><p></p></td></tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgEmail" className="label">이메일</label>
                                </th>
                                <td>
                                    <OrgEmail org={org} setOrg={setOrg} setEmailChk={setEmailChk} orgEmailId={orgEmailId} setOrgEmailId={setOrgEmailId}
                                    orgEmailDomain={orgEmailDomain} setOrgEmailDomain={setOrgEmailDomain} orgEmailIdRef={orgEmailIdRef} orgEmailDomainRef={orgEmailDomainRef}/>
                                </td>
                            </tr>
                            <tr><td></td><td><p></p></td></tr>
                            <tr>
                                <th>
                                    <label className="label">주소</label>
                                </th>
                                <td>
                                    <OrgAddr org={org} setOrg={setOrg} addressRef={addressRef}/>
                                </td>
                            </tr>
                            <tr><td></td><td><p></p></td></tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgIntroduce" className="label">단체 설명</label>
                                </th>
                                <td>
                                    <TextField id="orgIntroduce" className="input-first" inputRef={orgIntroduceRef}
                                    multiline rows={4} value={org.orgIntroduce} onChange={chgOrg}/>
                                </td>
                            </tr>
                            <tr><td></td><td><p className="key-up">{keyUp}/150</p></td></tr>
                            <tr>
                                <th>
                                    <label htmlFor="orgAccount" className="label">계좌번호</label>
                                </th>
                                <td>
                                    <Select name="orgAccountBank" id="orgAccountBank" value={bankSelect} inputRef={orgAccountBankRef}
                                    onChange={selectAccountBank} style={{marginRight : "5px", width : "125px"}}>
                                        <MenuItem  value="select">--선택--</MenuItem >
                                        <MenuItem  value="국민은행">국민은행</MenuItem >
                                        <MenuItem  value="신한은행">신한은행</MenuItem >
                                        <MenuItem  value="하나은행">하나은행</MenuItem >
                                        <MenuItem  value="우리은행">우리은행</MenuItem >
                                        <MenuItem  value="iM뱅크">iM뱅크</MenuItem >
                                        <MenuItem  value="기업은행">기업은행</MenuItem >
                                        <MenuItem  value="농협은행">농협은행</MenuItem >
                                        <MenuItem  value="우체국">우체국</MenuItem >
                                        <MenuItem  value="카카오뱅크">카카오뱅크</MenuItem >
                                        <MenuItem  value="토스뱅크">토스뱅크</MenuItem >
                                    </Select>
                                    <TextField type="text" id="orgAccount" className="input-account" inputRef={orgAccountRef}
                                    value={org.orgAccount} onChange={chgOrg} onBlur={checkAccount} placeholder="'-'를 제외하고 숫자만 입력해주세요"/>
                                    <p style={{color : "red"}}>*잘못 입력 시 송금에 차질이 생길 수 있습니다.</p>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={2}>
                                    <Button variant="contained" type="submit" className="nextBtn" id="mui-btn" style={{margin : "10px 0", height : "40px", fontSize : "20px"}}>다음</Button>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </form>
            </div>
        </section>
    )
}

/*아이디 관련 코드*/
function OrgId(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const org = props.org;
    const chgOrg = props.chgOrg;
    const idChk = props.idChk;
    const setIdChk = props.setIdChk;
    const orgIdRef = props.orgIdRef;

    //아이디 입력 후 포커스를 잃었을 때 호출함수 (onBlur)
    function checkOrgId(e){
        //아이디 정규 표현식
        const regExp = /^[a-zA-Z0-9]{6,20}$/; //영대,소문자와 숫자로 이루어진 6~20글자

        if(!regExp.test(e.target.value)){
            //유효성 검증 실패인 경우
            setIdChk(2);
        }else{
            setIdChk(0);
        }
        
    }

    //중복체크 버튼 클릭 시 호출 함수
    function checkOrgIdUnique(){
        if(idChk != 2){ //유효성 검증 체크 성공인 경우
            //DB에 중복된 아이디 존재하는지 체크하기 위해 서버에 아이디 전달하며 중복 체크 요청
            let options = {};
            options.url = serverUrl + "/org/" + org.orgId + "/chkId";
            options.method = "get";

            axiosInstance(options)
            .then(function(res){
                if(res.data.resData == 1){
                    setIdChk(3); //중복된 아이디가 존재하는 경우
                    Swal.fire({
                        title : "알림",
                        text : "이미 사용중인 아이디입니다.",
                        icon : "warning",
                        confirmButtonText : "확인",
                        didClose : orgIdRef.current.focus()
                    });
                }else if(res.data.resData == 0){ //중복된 아이디가 존재하지 않는 경우
                    setIdChk(1); //회원가입 가능한 상태
                    Swal.fire({
                        title : "알림",
                        text : "사용 가능한 아이디입니다.",
                        icon : "success",
                        confirmButtonText : "확인"
                    });
                }
            })
            .catch(function(err){
                console.log(err);
            });
        }else{ //유효성 검증 실패인 경우
            Swal.fire({
                title : "알림",
                text : "아이디 형식이 올바르지 않습니다.",
                icon : "warning",
                confirmButtonText : "확인",
                didClose : orgIdRef.current.focus()
            });
        }
    }

    return (
        <>
            <TextField type="text" id="orgId" className="input-id" value={org.orgId} inputRef={orgIdRef}
            onChange={chgOrg} onBlur={checkOrgId} placeholder="영대소문자와 숫자로 이루어진 6~20글자"/>
            <Button variant="contained" type="button" onClick={checkOrgIdUnique} style={{marginLeft : "10px"}} id="mui-btn">중복체크</Button>
        </>
    )
}

/*이메일 관련 코드*/
function OrgEmail(props){
    const org = props.org;
    const setOrg = props.setOrg;
    const setEmailChk = props.setEmailChk;
    const orgEmailId = props.orgEmailId;
    const setOrgEmailId = props.setOrgEmailId;
    const orgEmailDomain = props.orgEmailDomain;
    const setOrgEmailDomain = props.setOrgEmailDomain;
    const orgEmailIdRef = props.orgEmailIdRef;
    const orgEmailDomainRef = props.orgEmailDomainRef;

    const [isCustom, setIsCustom] = useState(true);             //이메일 도메인 직접 입력 선택 여부

    //이메일 아이디 값 onChange 호출 함수
    function chgEmailId(e){
        setOrgEmailId(e.target.value);
    }
    
    //이메일 도메인 선택 값 onChange 호출 함수
    function selectEmailDomain(e){
        const emailDomain = e.target.value;

        if (emailDomain === "custom") { //직접 입력 선택 시
            //isCustom을 true로 유지하며 입력창에 빈 값 유지
            setIsCustom(true);
            setOrgEmailDomain("");
        }else{ //특정 도메인 선택 시
            //setIsCustom flase로 변경하여 입력 못하게 설정, 해당 도메인 값 입력
            setIsCustom(false);
            setOrgEmailDomain(emailDomain);
        }
    }

    //직접 입력 선택 시 이메일 도메인 값 onChange 호출 함수
    function chgEmailDomain(e){
        if (isCustom) {
            setOrgEmailDomain(e.target.value);
        }
    }

    //전체 이메일 값 org State 변수에 저장
    useEffect(function(){
        if(orgEmailId && orgEmailDomain){
            const orgEmail = orgEmailId + "@" + orgEmailDomain;
            setOrg({...org, orgEmail : orgEmail});
        }
    }, [orgEmailId, orgEmailDomain]);


    useEffect(function(){
        //이메일 아이디 정규 표현식
        const idRegExp = /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*$/;

        //이메일 도메인 정규 표현식
        const domainRegExp = /^[a-zA-Z]([-_.]?[0-9a-zA-Z])+(\.[a-z]{2,3})$/;
        
        if(orgEmailId != ""){ //이메일 아이디 입력
            if(!idRegExp.test(orgEmailId)){
                setEmailChk(2); //아이디 유효성 체크 실패
            }else if(orgEmailDomain == ""){
                setEmailChk(3); //도메인 입력 X
            }else if(!domainRegExp.test(orgEmailDomain)){
                setEmailChk(4); //도메인 유효성 체크 실패
            }else{
                setEmailChk(1); //모두 유효성 체크 통과
            }
        }else if(orgEmailDomain != ""){
            if(!domainRegExp.test(orgEmailDomain)){
                setEmailChk(4); //도메인 유효성 체크 실패
            }else if(orgEmailId == ""){
                setEmailChk(5); //아이디 입력 X
            }else if(!idRegExp.test(orgEmailId)){
                setEmailChk(2); //아이디 유효성 체크 실패
            }else{
                setEmailChk(1);
            }
        }
    }, [orgEmailId, orgEmailDomain]);

    return (
        <>
            <TextField type="text" id="orgEmailId" className="input-email" inputRef={orgEmailIdRef}
            value={orgEmailId} onChange={chgEmailId}/>
            &nbsp;@&nbsp;
            <TextField type="text" id="orgEmailDomain" className="input-email" inputRef={orgEmailDomainRef}
            value={orgEmailDomain} onChange={chgEmailDomain} readOnly={!isCustom}/>
            <Select name="eamilDomain" onChange={selectEmailDomain} value={isCustom ? 'custom' : orgEmailDomain} style={{marginLeft : "5px", width : "125px"}}>
                <MenuItem  value="custom">직접 입력</MenuItem >
                <MenuItem  value="naver.com">naver.com</MenuItem >
                <MenuItem  value="gmail.com">gmail.com</MenuItem >
                <MenuItem  value="daum.net">daum.net</MenuItem >
                <MenuItem  value="kakao.com">kakao.com</MenuItem >
                <MenuItem  value="nate.com">nate.com</MenuItem >
            </Select>
        </>
    )
}

/*주소 관련 코드*/
function OrgAddr(props){
    const org = props.org;
    const setOrg = props.setOrg;
    const addressRef = props.addressRef;

    //다음 주소 API 불러오기
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);
    
    //상세주소
    const detailAddressRef = useRef(null);
    
    //다음 주소 API 실행 코드
    function execDaumPostcode (){

        new window.daum.Postcode({
            oncomplete: function (data) {
                let addr = ''; // 주소

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                addressRef.current.value = addr;
                
                //주소 값 State 변수에 저장
                setOrg({...org, orgAddrMain : addr})

                detailAddressRef.current.focus();
            }
        }).open();
    }
    
    //상세 주소 값 onChange 호출 함수
    function chgAddrDetail(e){
        //상세 주소 값 State 변수에 저장
        setOrg({...org, orgAddrDetail : e.target.value});
    }

    return (
        <>
            <TextField type="text" id="orgAddrMain" className="input-addr" inputRef={addressRef} placeholder="주소" slotProps={{input: {readOnly: true}}}/>
            <Button variant="contained" type="button" id="mui-btn" onClick={execDaumPostcode} style={{marginLeft : "10px", marginBottom : "5px"}}>주소 찾기</Button> <br/>
            <TextField type="text" id="orgAddrDetail" className="input-first" inputRef={detailAddressRef}
            value={org.orgAddrDetail} onChange={chgAddrDetail} placeholder="상세주소"/>
        </>
    )
}