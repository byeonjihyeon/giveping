import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";

//개인 회원 회원가입 페이지
export default function JoinMember(props){
    const navigate = useNavigate();
    
    const member = props.member;
    const setMember = props.setMember;

    //아이디, 비밀번호, 이름, 전화번호 onChange 호출 함수
    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
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
    const [memberPwRe, setMemberPwRe] = useState("");

    //비밀번호 확인 값 onChange 호출 함수
    function chgMemberPwRe(e){
        setMemberPwRe(e.target.value);
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

    //비밀번호 값 onBlur 함수
    function checkMemberPw(e){
        //비밀번호 정규 표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대소문자, 특수문자, 숫자 6~30글자

        if(e.target.id == "memberPw"){ //비밀번호 입력
            if(!regExp.test(e.target.value)){
                //비밀번호 유효성 체크 실패
                setPwChk(2);
            }else if(memberPwRe != ""){ //비밀번호 확인 입력된 경우
                if(e.target.value == memberPwRe){//비밀번호 == 비밀번호 확인
                    setPwChk(1);
                }else{
                    setPwChk(3);
                }
            }else{
                setPwChk(4); //비밀번호 확인값 미입력
            }
        }else { //비밀번호 확인 입력
            if(member.memberPw == e.target.value){//비밀번호 == 비밀번호 확인
                if(regExp.test(member.memberPw)){ //비밀번호 유효성 검증 통과
                    setPwChk(1);
                }
            }else{ //비밀번호와 확인값 불일치
                setPwChk(3);
            }
        }
    }


    /*이름 관련 코드*/
    /*
    이름 검증 결과 저장 변수
    0 : 검사 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [nameChk, setNameChk] = useState(0);

    //이름 값 onBlur 함수
    function checkMemberName(e){
        //이름 정규표현식
        const regExp = /^[가-힣]{2,10}$/; //이름은 한글 2~10글자
        
        if(!regExp.test(e.target.value)){
            setNameChk(2);  //유효성 체크 실패
        }else{
            setNameChk(1);  //유효성 체크 통과
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
    function checkMemberPhone(e){
        //전환번호 정규표현식
        const regExp = /^010-\d{3,4}-\d{4}/;

        if(!regExp.test(e.target.value)){
            setPhoneChk(2); //유효성 체크 실패
        }else{
            setPhoneChk(1); //유효성 체크 통과
        }
    }


    /*생년월일 관련 코드*/
    //생년월일 값 저장할 변수
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, "0");
    const today = currentYear + "-" + currentMonth + "-" + currentDay;  //오늘 날짜



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


    //다음 버튼 클릭 시 호출 함수
    function insertMember(){
        // 유효성 조건 리스트
        const validations = [
            { valid: member.memberId !== "" && idChk !== 1, message: "아이디 중복체크를 하세요." },
            { valid: idChk !== 1, message: "아이디를 확인하세요." },
            { valid: pwChk !== 1 && memberPwRe !== "", message: "비밀번호를 확인하세요." },
            { valid: memberPwRe === "", message: "비밀번호 확인을 입력하세요." },
            { valid: nameChk != 1, message: "이름을 입력하세요." },
            { valid: phoneChk !== 1, message: "전화번호를 확인하세요." },
            { valid: member.memberBirth >= today, message: "생년월일을 확인하세요." },
            { valid: emailChk !== 1, message: "이메일을 확인하세요." },
            { valid: member.memberAddrMain === "", message: "주소를 입력하세요." }
        ];

        // 검증 실패 시 첫 번째 오류 메시지 띄우고 return
        for (let i = 0; i < validations.length; i++) {
            if (validations[i].valid) {
                Swal.fire({
                    title: "알림",
                    text: validations[i].message,
                    icon: "warning",
                    confirmButtonText: "확인"
                });
                return;
            }
        }
    
        // 모든 조건 통과 시 페이지 이동
        navigate("/join/category");
    }

    return (
        <section className="section join-wrap">
            <div className="page-title">개인 회원가입</div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어
                insertMember();     //다음 버튼 클릭 시 호출 함수
            }}>
                <table className="tbl-join">
                    <tbody>
                        <tr>
                            <th>
                                <label htmlFor="memberId">아이디</label>
                            </th>
                            <td>
                                <MemberId member={member} chgMember={chgMember} idChk={idChk} setIdChk={setIdChk}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="memberPw">비밀번호</label>
                            </th>
                            <td>
                                <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember} onBlur={checkMemberPw} placeholder="영대소문자, 숫자, 특수문자로 이루어진 6~30글자"/>
                                <p>{pwChk == 2 ? "비밀번호는 영대소문자, 숫자, 특수문자로 이루어진 6~30글자입니다." : ""}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="memberPwRe">비밀번호 확인</label>
                            </th>
                            <td>
                                <input type="password" id="memberPwRe" value={memberPwRe} onChange={chgMemberPwRe} onBlur={checkMemberPw}/>
                                <p>{pwChk == 3 ? "비밀번호와 일치하지 않습니다." : ""}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="memberName">이름</label>
                            </th>
                            <td>
                                <input type="text" id="memberName" value={member.memberName} onChange={chgMember} onBlur={checkMemberName}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="memberPhone">전화번호</label>
                            </th>
                            <td>
                                <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember} onBlur={checkMemberPhone} placeholder="'-'를 포함해서 작성해주세요"/>
                            </td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td>
                                <MemberBirth member={member} setMember={setMember} currentYear={currentYear} currentMonth={currentMonth} currentDay={currentDay}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="memberEmailId">이메일</label>
                            </th>
                            <td>
                                <MemberEmail member={member} setMember={setMember} setEmailChk={setEmailChk}/>
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <MemberAddr member={member} setMember={setMember}/>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button type="submit">다음</button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </section>
    )
}

/*아이디 관련 코드*/
function MemberId(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const member = props.member;
    const chgMember = props.chgMember;
    const idChk = props.idChk;
    const setIdChk = props.setIdChk;

    //아이디 입력 후 포커스를 잃었을 때 호출함수 (onBlur)
    function checkMemberId(e){
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
    function checkMemberIdUnique(){
        if(idChk != 2){ //유효성 검증 체크 성공인 경우
            //DB에 중복된 아이디 존재하는지 체크하기 위해 서버에 아이디 전달하며 중복 체크 요청
            let options = {};
            options.url = serverUrl + "/member/" + member.memberId + "/chkId";
            options.method = "get";

            axiosInstance(options)
            .then(function(res){
                if(res.data.resData == 1){
                    setIdChk(3); //중복된 아이디가 존재하는 경우
                    Swal.fire({
                        title : "알림",
                        text : "이미 사용중인 아이디입니다.",
                        icon : "warning",
                        confirmButtonText : "확인"
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
                confirmButtonText : "확인"
            });
        }
    }

    return (
        <>
            <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={checkMemberId} placeholder="영대소문자와 숫자로 이루어진 6~20글자"/>
            <button type="button" onClick={checkMemberIdUnique}>중복체크</button>
            <p>{idChk == 2 ? "아이디는 영대소문자와 숫자로 이루어진 6~20글자입니다." : ""}</p>
        </>
    )
}

/*생년월일 관련 코드*/
function MemberBirth(props){
    const member = props.member;
    const setMember = props.setMember;
    const currentYear = props.currentYear;
    const currentMonth = props.currentMonth;
    const currentDay = props.currentDay;

    const [birthYear, setBirthYear] = useState(String(currentYear));
    const [birthMonth, setBirthMonth] = useState(currentMonth);
    const [birthDay, setBirthDay] = useState(currentDay);

    //년, 월, 일 option값에 들어갈 리스트
    const years = [];
    for (let i=1900; i<=currentYear; i++) {
        years.push(String(i));
    }

    const months = [];
    for (let i=1; i<=12; i++) {
        months.push(String(i).padStart(2, '0'));
    }

    const [days, setDays] = useState([]);

    //월별 일 수 계산
    useEffect(function () {
        const year = parseInt(birthYear, 10);
        const month = parseInt(birthMonth, 10);

        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        let lastDay = 31;
        if (month === 2) {
            lastDay = isLeap ? 29 : 28;
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            lastDay = 30;
        }

        let newDays = [];
        for (let i=1; i<=lastDay; i++) {
            newDays.push(String(i).padStart(2, "0"));
        }
        setDays(newDays);

        if (parseInt(birthDay) > lastDay) {
            setBirthDay(String(lastDay).padStart(2, '0'));
        }
    }, [birthYear, birthMonth]);

    //생년월일 값 onChange 호출 함수
    function handleYearChange(e) {
    setBirthYear(e.target.value);
    }
    function handleMonthChange(e) {
    setBirthMonth(e.target.value);
    }
    function handleDayChange(e) {
    setBirthDay(e.target.value);
    }

    //전체 생년월일 값 member State 변수에 저장
    useEffect(function(){
        if(birthYear && birthMonth && birthDay){
            const memberBirth = birthYear + "-" + birthMonth + "-" + birthDay;
            setMember({...member, memberBirth : memberBirth});
        }
    }, [birthYear, birthMonth, birthDay]);

    return (
        <>
        <select name="birthYear" value={birthYear} onChange={handleYearChange}>
            {years.map(function(y, index){
                return  <option key={"y"+index} value={y}>{y}년</option>
            })}
        </select>
        <select name="birthMonth" value={birthMonth} onChange={handleMonthChange}>
            {months.map(function(m, index){
                return  <option key={"m"+index} value={m}>{m}월</option>
            })}
        </select>
        <select name="birthDay" value={birthDay} onChange={handleDayChange}>
            {days.map(function(d, index){
                return  <option key={"d"+index} value={d}>{d}일</option>
            })}
        </select>
        </>
    )
}

/*이메일 관련 코드*/
function MemberEmail(props){
    const member = props.member;
    const setMember = props.setMember;
    const setEmailChk = props.setEmailChk;

    //이메일 값 변경 시 저장 변수
    const [memberEmailId, setMemberEmailId] = useState("");         //이메일 아이디
    const [memberEmailDomain, setMemberEmailDomain] = useState(""); //이메일 도메인
    const [isCustom, setIsCustom] = useState(true);                 //이메일 도메인 직접 입력 선택 여부

    //이메일 아이디 값 onChange 호출 함수
    function chgEmailId(e){
        setMemberEmailId(e.target.value);
    }
    
    //이메일 도메인 선택 값 onChange 호출 함수
    function selectEmailDomain(e){
        const emailDomain = e.target.value;

        if (emailDomain === "custom") { //직접 입력 선택 시
            //isCustom을 true로 유지하며 입력창에 빈 값 유지
            setIsCustom(true);
            setMemberEmailDomain("");
        }else{ //특정 도메인 선택 시
            //setIsCustom flase로 변경하여 입력 못하게 설정, 해당 도메인 값 입력
            setIsCustom(false);
            setMemberEmailDomain(emailDomain);
        }
    }

    //직접 입력 선택 시 이메일 도메인 값 onChange 호출 함수
    function chgEmailDomain(e){
        if (isCustom) {
            setMemberEmailDomain(e.target.value);
        }
    }

    //전체 이메일 값 member State 변수에 저장
    useEffect(function(){
        if(memberEmailId && memberEmailDomain){
            const memberEmail = memberEmailId + "@" + memberEmailDomain;
            setMember({...member, memberEmail : memberEmail});
        }
    }, [memberEmailId, memberEmailDomain]);

    useEffect(function(){
        //이메일 아이디 정규 표현식
        const idRegExp = /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*$/;

        //이메일 도메인 정규 표현식
		const domainRegExp = /^[a-zA-Z]([-_.]?[0-9a-zA-Z])+(\.[a-z]{2,3})$/;
        
        if(memberEmailId != ""){ //이메일 아이디 입력
            if(!idRegExp.test(memberEmailId)){
                setEmailChk(2); //아이디 유효성 체크 실패
            }else if(memberEmailDomain == ""){
                setEmailChk(3); //도메인 입력 X
            }else if(!domainRegExp.test(memberEmailDomain)){
                setEmailChk(4); //도메인 유효성 체크 실패
            }else{
                setEmailChk(1); //모두 유효성 체크 통과
            }
        }else if(memberEmailDomain != ""){
            if(!domainRegExp.test(memberEmailDomain)){
                setEmailChk(4); //도메인 유효성 체크 실패
            }else if(memberEmailId == ""){
                setEmailChk(5); //아이디 입력 X
            }else if(!idRegExp.test(memberEmailId)){
                setEmailChk(2); //아이디 유효성 체크 실패
            }else{
                setEmailChk(1);
            }
        }
    }, [memberEmailId, memberEmailDomain]);

    return (
        <>
        <input type="text" id="memberEmailId" value={memberEmailId} onChange={chgEmailId}/>@
        <input type="text" id="memberEmailDomain" value={memberEmailDomain} onChange={chgEmailDomain} readOnly={!isCustom}/>
        <select name="eamilDomain" onChange={selectEmailDomain} value={isCustom ? 'custom' : memberEmailDomain}>
            <option value="custom">직접 입력</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
            <option value="kakao.com">kakao.com</option>
            <option value="nate.com">nate.com</option>
        </select>
        </>
    )
}

/*주소 관련 코드*/
function MemberAddr(props){
    const member = props.member;
    const setMember = props.setMember;

    //다음 주소 API 불러오기
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);
    
    //주소, 상세주소 useRef
    const addressRef = useRef(null);
    const detailAddressRef = useRef(null);
    
    //상세 주소 값 변경 시 저장 변수
    const [addrDetail, setAddrDetail] = useState("");

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
                setMember({...member, memberAddrMain : addr})

                detailAddressRef.current.focus();
            }
        }).open();
    }
    
    //상세 주소 값 onChange 호출 함수
    function chgAddrDetail(e){
        //상세 주소 값 State 변수에 저장
        setMember({...member, memberAddrDetail : e.target.value});
    }

    return (
        <>
            <input type="text" ref={addressRef} placeholder="주소" readOnly/>
            <button type="button" onClick={execDaumPostcode}>주소 찾기</button> <br/>
            <input type="text" ref={detailAddressRef} placeholder="상세주소" value={member.memberAddrDetail} onChange={chgAddrDetail}/>
        </>
    )
}