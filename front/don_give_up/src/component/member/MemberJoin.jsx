import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//개인 회원 회원가입 페이지
export default function MemberJoin(props){
    const navigate = useNavigate();
    
    const member = props.member;
    const setMember = props.setMember;

    //아이디, 비밀번호, 이름, 전화번호 onChange 호출 함수
    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }


    //아이디 관련 코드
    /*
    아이디 유효성 체크 결과, 중복 체크 결과를 저장할 변수
    0 : 검증 이전 상태
    1 : 회원가입 가능한 상태(유효성 검증, 중복 체크 통과)
    2 : 유효성 체크 실패
    3 : 중복된 아이디가 존재하는 경우 
    */
    const [idChk, setIdChk] = useState(0);

    //아이디 입력 후 포커스를 잃었을 때 호출함수 (onBlur)
    function checkMemberId(e){
        //아이디 정규 표현식
        const regExp = /^[a-zA-Z0-9]{6,20}$/;

        if(!regExp.test(e.target.value)){
            //유효성 검증 실패인 경우
            setIdChk(2);
        }else{
            //유효성 검증 성공인 경우 -> DB에 중복된 아이디 존재하는지 체크하기 위해 서버에 아이디 전달하며 중복 체크 요청
            /*
            let options = {};
            options.url = serverUrl + "/member/" + member.memberId + "/chkId";
            options.method = "get"; //조회 == GET

            axiosInstance(options)
            .then(function(res){
                //res.data == ResponseDTO
                //res.data.resData == count == 중복 체크 결과
                if(res.data.resData == 1){
                    //중복된 아이디가 존재하는 경우
                    setIdChk(3);
                }else if(res.data.resData == 0){
                    //중복된 아이디가 존재하지 않는 경우
                    setIdChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
            });
            */
        }
    }


    //비밀번호 확인 값 변경 시 저장 변수 (서버 전송 X. 화면에서 처리를 위함)
    const [memberPwRe, setMemberPwRe] = useState("");

    //비밀번호 확인 값 onChange 호출 함수
    function chgMemberPwRe(e){
        setMemberPwRe(e.target.value);
    }


    //생년월일 값 저장할 변수
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, "0");

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


    //다음 주소 API 불러오기
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);
    
    //우편번호, 주소, 상세주소, 참고항목 useRef
    const postcodeRef = useRef(null);
    const addressRef = useRef(null);
    const extraAddressRef = useRef(null);
    const detailAddressRef = useRef(null);
    
    //상세 주소 값 변경 시 저장 변수
    const [addrDetail, setAddrDetail] = useState("");

    //다음 주소 API 실행 코드
    function execDaumPostcode (){
        new window.daum.Postcode({
            oncomplete: function (data) {
                let addr = ''; // 주소
                let extraAddr = ''; // 참고 항목

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                    extraAddressRef.current.value = extraAddr;
                } else {
                    extraAddressRef.current.value = '';
                }

                postcodeRef.current.value = data.zonecode;
                addressRef.current.value = addr;
                
                //주소 값 State 변수에 저장
                setMember({...member, memberAddr : addr + " " + addrDetail})

                detailAddressRef.current.focus();
            }
        }).open();
    }
    
    //상세 주소 값 onChange 호출 함수
    function chgAddrDetail(e){
        const newDetail = e.target.value;
        setAddrDetail(newDetail);

        //주소 값 State 변수에 저장
        const mainAddress = addressRef.current.value || '';
        setMember({...member, memberAddr : mainAddress + " " + newDetail});
    }


    //다음 버튼 클릭 시 호출 함수
    function insertMember(){
        navigate("/join/category");
    }

    return (
        <section className="section join-wrap">
            <div className="page-title">개인 회원가입</div>
            <form onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어
                insertMember();     //다음 버튼 클릭 시 호출 함수
            }}>
                <div>
                    <label htmlFor="memberId">아이디</label>
                    <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={checkMemberId}/>
                    <button>중복체크</button>
                    <p>아이디 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="memberPw">비밀번호</label>
                    <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember}/>
                    <p>비밀번호 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="memberPwRe">비밀번호 확인</label>
                    <input type="password" id="memberPwRe" value={memberPwRe} onChange={chgMemberPwRe}/>
                    <p>비밀번호와 일치하지 않습니다.</p>
                </div>
                <div>
                    <label htmlFor="memberName">이름</label>
                    <input type="text" id="memberName" value={member.memberName} onChange={chgMember}/>
                </div>
                <div>
                    <label htmlFor="memberPhone">전화번호</label>
                    <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember}/>
                </div>
                <div>
                    <label>생년월일</label>
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
                </div>
                <div>
                    <label htmlFor="memberEmailId">이메일</label>
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
                </div>
                <div>
                    <label>주소</label>
                    <input type="text" ref={postcodeRef} placeholder="우편번호" readOnly/>
                    <button type="button" onClick={execDaumPostcode}>우편번호 찾기</button><br />
                    <input type="text" ref={addressRef} placeholder="주소" readOnly/>
                    <input type="text" ref={extraAddressRef} placeholder="참고항목" readOnly/><br />
                    <input type="text" ref={detailAddressRef} placeholder="상세주소" value={addrDetail} onChange={chgAddrDetail}/>
                </div>
                <div>
                    <button type="submit">다음</button>
                </div>
            </form>
            <button onClick={function(){
                console.log(member);
            }}>테스트</button>
        </section>
    )
}