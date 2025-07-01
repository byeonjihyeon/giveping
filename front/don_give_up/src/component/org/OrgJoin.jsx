import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";

//단체 회원 회원가입 페이지
export default function OrgJoin(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const org = props.org;
    const setOrg = props.setOrg;

    //아이디, 비밀번호, 단체명, 사업자번호, 전화번호, 단체 설명, 계좌번호 onChange 호출 함수
    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
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
        const regExp = /^\d{2,3}-\d{3}-\d{4}/;

        if(!regExp.test(e.target.value)){
            setPhoneChk(2); //유효성 체크 실패
        }else{
            setPhoneChk(1); //유효성 체크 통과
        }
    }


    /*이메일 관련 코드*/
    //이메일 값 변경 시 저장 변수
    const [orgEmailId, setOrgEmailId] = useState("");           //이메일 아이디
    const [orgEmailDomain, setOrgEmailDomain] = useState("");   //이메일 도메인
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


    /*주소 관련 코드*/
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
                setOrg({...org, orgAddr : addr + " " + addrDetail})

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
        setOrg({...org, orgAddr : mainAddress + " " + newDetail});
    }


    /*계좌번호 관련 코드*/
    //은행 선택 시 State 변수에 저장
    function selectAccountBank(e){
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


    //다음 버튼 클릭 시 호출 함수
    function insertOrg(){
        if(idChk == 1 && pwChk == 1 &&
           orgPwRe != "" && org.orgName != "" &&
           biznumChk== 1 && phoneChk == 1 && 
           emailChk == 1 && org.orgAddr != "" &&
           org.orgIntroduce != "" && accountChk == 1 &&
           org.orgAccountBank != "" && org.orgAccountBank != "select"){
            navigate("/join/category");
        }else if(org.orgId != "" && idChk == 0){
            Swal.fire({
                title : "알림",
                text : "아이디 중복체크를 하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(idChk != 1){
            Swal.fire({
                title : "알림",
                text : "아이디를 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(pwChk != 1 && orgPwRe != ""){
            Swal.fire({
                title : "알림",
                text : "비밀번호를 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(orgPwRe == ""){
            Swal.fire({
                title : "알림",
                text : "비밀번호 확인을 입력하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(org.orgName == ""){
            Swal.fire({
                title : "알림",
                text : "단체명을 입력하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(biznumChk != 1){
            Swal.fire({
                title : "알림",
                text : "사업자번호를 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(phoneChk != 1){
            Swal.fire({
                title : "알림",
                text : "전화번호를 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(emailChk != 1){
            Swal.fire({
                title : "알림",
                text : "이메일을 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(org.orgAddr == ""){
            Swal.fire({
                title : "알림",
                text : "주소를 입력하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(org.orgIntroduce == ""){
            Swal.fire({
                title : "알림",
                text : "단체설명을 입력하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(org.orgAccountBank == "" || org.orgAccountBank == "select"){
            Swal.fire({
                title : "알림",
                text : "은행을 선택하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }else if(accountChk != 1){
            Swal.fire({
                title : "알림",
                text : "계좌번호를 확인하세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
        }
    }

    return (
        <section className="section join-wrap">
            <div className="page-title">단체 회원가입</div>
            <form onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어
                insertOrg();     //다음 버튼 클릭 시 호출 함수
            }}>
                <table className="tbl-join">
                    <tbody>
                        <tr>
                            <th>
                                <label htmlFor="orgId">아이디</label>
                            </th>
                            <td>
                                <input type="text" id="orgId" value={org.orgId} onChange={chgOrg} onBlur={checkOrgId} placeholder="영대소문자와 숫자로 이루어진 6~20글자"/>
                                <button type="button" onClick={checkOrgIdUnique}>중복체크</button>
                                <p>{idChk == 2 ? "아이디는 영대소문자와 숫자로 이루어진 6~20글자입니다." : ""}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgPw">비밀번호</label>
                            </th>
                            <td>
                                <input type="password" id="orgPw" value={org.orgPw} onChange={chgOrg} onBlur={checkOrgPw} placeholder="영대소문자, 숫자, 특수문자로 이루어진 6~30글자"/>
                                <p>{pwChk == 2 ? "비밀번호는 영대소문자, 숫자, 특수문자로 이루어진 6~30글자입니다." : ""}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgPwRe">비밀번호 확인</label>
                            </th>
                            <td>
                                <input type="password" id="orgPwRe" value={orgPwRe} onChange={chgOrgPwRe} onBlur={checkOrgPw}/>
                                <p>{pwChk == 3 ? "비밀번호와 일치하지 않습니다." : ""}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgName">단체명</label>
                            </th>
                            <td>
                                <input type="text" id="orgName" value={org.orgName} onChange={chgOrg}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgBiznum">사업자 번호</label>
                            </th>
                            <td>
                                <input type="text" id="orgBiznum" value={org.orgBiznum} onChange={chgOrg} onBlur={checkOrgBiznum} placeholder="'-'를 포함해서 작성해주세요"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgPhone">전화번호</label>
                            </th>
                            <td>
                                <input type="text" id="orgPhone" value={org.org} onChange={chgOrg} onBlur={checkOrgPhone} placeholder="'-'를 포함해서 작성해주세요"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgEmail">이메일</label>
                            </th>
                            <td>
                                <input type="text" id="orgEmail" value={orgEmailId} onChange={chgEmailId}/>@
                                <input type="text" id="orgEmailDomain" value={orgEmailDomain} onChange={chgEmailDomain} readOnly={!isCustom}/>
                                <select name="eamilDomain" onChange={selectEmailDomain} value={isCustom ? 'custom' : orgEmailDomain}>
                                    <option value="custom">직접 입력</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="kakao.com">kakao.com</option>
                                    <option value="nate.com">nate.com</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgAddr">주소</label>
                            </th>
                            <td>
                                <input type="text" ref={postcodeRef} placeholder="우편번호" readOnly/>
                                <button type="button" onClick={execDaumPostcode}>우편번호 찾기</button><br />
                                <input type="text" ref={addressRef} placeholder="주소" readOnly/>
                                <input type="text" ref={extraAddressRef} placeholder="참고항목" readOnly/><br />
                                <input type="text" ref={detailAddressRef} placeholder="상세주소" value={addrDetail} onChange={chgAddrDetail}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgIntroduce">단체 설명</label>
                            </th>
                            <td>
                                <textarea id="orgIntroduce" value={org.orgIntroduce} onChange={chgOrg}></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="orgAccount">계좌번호</label>
                            </th>
                            <td>
                                <select name="orgAccountBank" id="orgAccountBank" onChange={selectAccountBank}>
                                    <option value="select">--선택--</option>
                                    <option value="국민은행">국민은행</option>
                                    <option value="신한은행">신한은행</option>
                                    <option value="하나은행">하나은행</option>
                                    <option value="우리은행">우리은행</option>
                                    <option value="iM뱅크">iM뱅크</option>
                                    <option value="기업은행">기업은행</option>
                                    <option value="농협은행">농협은행</option>
                                    <option value="우체국">우체국</option>
                                    <option value="카카오뱅크">카카오뱅크</option>
                                    <option value="토스뱅크">토스뱅크</option>
                                </select>
                                <input type="text" id="orgAccount" value={org.orgAccount} onChange={chgOrg} onBlur={checkAccount} placeholder="'-'를 제외하고 숫자만 입력해주세요"/>
                                <p>*잘못 입력 시 송금에 차질이 생길 수 있습니다.</p>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button>다음</button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </section>
    )
}