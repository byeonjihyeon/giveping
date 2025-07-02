import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useRef, useState } from "react";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//단체 정보 수정
export default function OrgUpdate(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    //단체 번호를 가져오기 위함
    const {loginOrg} = useUserStore();

    //단체 1개 정보를 저장할 State 변수
    const [org, setOrg] = useState({
        orgNo : loginOrg.orgNo, orgId : "", orgName : "", orgBiznum : "", orgPhone : "", orgEmail : "", orgAddrMain : "",
        orgAddrDetail : "", orgIntroduce : "", orgAccount : "", orgAccountBank : "", orgThumbPath : "", orgUrl : ""
    });

    //이메일 정보를 저장할 State 변수
    const [orgEmailId, setOrgEmailId] = useState("");
    const [orgEmailDomain, setOrgEmailDomain] = useState("");
    //이메일 유효성 체크 결과를 저장할 변수
    const [emailChk, setEmailChk] = useState(0);

    //기존 섬네일 서버 저장 파일명
    const [prevThumbPath, setPrevThumbPath] = useState(null);

    //단체 1개 정보 가져오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/" + loginOrg.orgNo;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            const newOrg = res.data.resData;
            newOrg.orgUrl = "";
            
            //이메일 내에서 @를 기준으로 아이디와 도메인 추출
            const [emailId, emailDomain] = newOrg.orgEmail.split("@");
            
            setOrgEmailId(emailId);
            setOrgEmailDomain(emailDomain);
            setPrevThumbPath(org.orgThumbPath);

            setOrg(newOrg);
        });
    }, []);

    //게시글 썸네일 이미지 파일 객체
    const [orgThumb, setOrgThumb] = useState(null);
    //썸네일 이미지 미리보기용 변수(서버에 전송 X)
    const [thumbImg, setThumbImg] = useState(null);
    //input type=file인 썸네일 업로드 요소와 연결하여 사용
    const thumbFileEl = useRef(null);

    //썸네일 이미지 변경 시 호출 함수(onChange)
    function chgThumbFile(e){
        const files = e.target.files;
        
        if(files.length != 0 && files[0] != null){
            setOrgThumb(files[0]);    //게시글 등록하기 클릭 시 서버에 전송될 썸네일 파일 객체

            //썸네일 이미지 화면에 보여주기
            const reader = new FileReader();    //브라우저에서 파일을 비동기적으로 읽을 수 있게 해주는 객체
            reader.readAsDataURL(files[0]);     //파일 데이터 읽어오기
            reader.onloadend = function(){      //모두 읽어오면 실행할 함수 작성
                setThumbImg(reader.result);     //미리보기용 State 변수에 세팅
            }
        }else{
            //업로드 팝업 취소한 경우 썹네일 파일 객체와 미리보기용 변수 초기화
            setOrgThumb(null);
            setThumbImg(null);
        }
    }

    //input 태그 안 내용 변경 시
    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
        console.log(org);
    }

    /*사업자번호 관련 코드*/
    /*
    사업자번호 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [biznumChk, setBiznumChk] = useState(0);

    useEffect(function(){
        //사업자번호 정규표현식
        const biznumRegExp = /^\d{3}-\d{2}-\d{5}/; //000-00-00000 형식

        if(!biznumRegExp.test(org.orgBiznum)){
            setBiznumChk(2); //유효성 체크 실패
        }else{
            setBiznumChk(1); //유효성 체크 통과
        }
    }, [org.orgBiznum]);


    /*전화번호 관련 코드*/
    /*
    전화번호 검증 결과 저장 변수
    0 : 검증 이전 상태
    1 : 유효성 체크 통과
    2 : 유효성 체크 실패
    */
    const [phoneChk, setPhoneChk] = useState(0);

    useEffect(function(){
        //전환번호 정규표현식
        const phoneRegExp = /^\d{2,3}-\d{3,4}-\d{4}/;

        if(!phoneRegExp.test(org.orgPhone)){
            setPhoneChk(2); //유효성 체크 실패
        }else{
            setPhoneChk(1); //유효성 체크 통과
        }
    },[org.orgPhone]);


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

    useEffect(function(){
        //계좌번호 정규표현식
        const regExp = /^\d{10,14}$/;

        if(!regExp.test(org.orgAccount)){
            setAccountChk(2);   //유효성 체크 실패
        }else{
            setAccountChk(1);   //유효성 체크 통과
        } 
    }, [org.orgAccount]);


    //수정 버튼 클릭 시 호출 함수
    function updateOrg(){
        // 유효성 조건 리스트
        const validations = [
            { valid: org.orgName === "", message: "단체명을 입력하세요." },
            { valid: biznumChk !== 1, message: "사업자번호를 확인하세요." },
            { valid: phoneChk !== 1, message: "전화번호를 확인하세요." },
            { valid: emailChk !== 1, message: "이메일을 확인하세요." },
            { valid: org.orgAddrMain === "", message: "주소를 입력하세요." },
            { valid: org.orgIntroduce === "", message: "단체설명을 입력하세요." },
            { valid: org.orgAccountBank === "" || org.orgAccountBank === "select", message: "은행을 선택하세요." },
            { valid: accountChk !== 1, message: "계좌번호를 확인하세요." }
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

        console.log(org);
        console.log(orgThumb);
        console.log(prevThumbPath);
        //파일 업로드 시 사용할 수 있는 내장 객체
        const form = new FormData();

        form.append("orgNo", loginOrg.orgNo);
        form.append("orgName", org.orgName);
        form.append("orgBiznum", org.orgBiznum);
        form.append("orgPhone", org.orgPhone);
        form.append("orgEmail", org.orgEmail);
        form.append("orgAddrMain", org.orgAddrMain);
        form.append("orgAddrDetail", org.orgAddrDetail);
        form.append("orgIntroduce", org.orgIntroduce);
        form.append("orgAccount", org.orgAccount);
        form.append("orgAccountBank", org.orgAccountBank);
        form.append("orgUrl", org.orgUrl);

        //form.append("org", org);
        //기존 썸네일 파일명
        if(prevThumbPath != null) {
            form.append("prevThumbPath", prevThumbPath);
        }

        //썸네일 등록한 경우에만 append
        if(orgThumb != null){
            form.append("orgThumb", orgThumb);
        }

        let options = {};
        options.url = serverUrl + "/org/update";
        options.method = "patch";
        options.data = form;
        options.header = {};
        options.header.contentType = "multipart/form-data";
        options.header.processData = false; //쿼리스트링으로 변환하지 않도록 설정

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
        <form autoComplete="off" onSubmit={function(e){
            e.preventDefault();
            updateOrg();
        }}>
            <table className="tbl-org" border={1}>
                <tbody>
                    <tr>
                        <th colSpan={2}>
                            <div>
                                <img style={{width : "100px"}} src={thumbImg ? thumbImg : prevThumbPath
                                            ? serverUrl + "/org/thumb/" + prevThumbPath.substring(0, 8) + "/" + org.orgThumb
                                            : "/images/default_profile.jpg"} onClick={function(e){
                                    thumbFileEl.current.click();
                                }}/>
                                <input type="file" accept="image/*" style={{display : "none"}} ref={thumbFileEl} onChange={chgThumbFile}/>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>아이디</th>
                        <td>{org.orgId}</td>
                    </tr>
                    <tr>
                        <th>단체명</th>
                        <td>
                            <input type="text" id="orgName" value={org.orgName} onChange={chgOrg}/>
                        </td>
                    </tr>
                    <tr>
                        <th>사업자 번호</th>
                        <td>
                            <input type="text" id="orgBiznum" value={org.orgBiznum} onChange={chgOrg} placeholder="'-'를 포함해서 작성해주세요"/>
                        </td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>
                            <input type="text" id="orgPhone" value={org.orgPhone} onChange={chgOrg} placeholder="'-'를 포함해서 작성해주세요"/>
                        </td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>
                            <MemberEamil org={org} setOrg={setOrg} orgEmailId={orgEmailId} setOrgEmailId={setOrgEmailId} 
                                orgEmailDomain={orgEmailDomain} setOrgEmailDomain={setOrgEmailDomain} setEmailChk={setEmailChk}/>
                        </td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>
                            <MemberAddr org={org} setOrg={setOrg}/>
                        </td>
                    </tr>
                    <tr>
                        <th>단체 설명</th>
                        <td>
                            <textarea id="orgIntroduce" value={org.orgIntroduce} onChange={chgOrg}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>계좌번호</th>
                        <td>
                            <select name="orgAccountBank" id="orgAccountBank" value={org.orgAccountBank} onChange={selectAccountBank}>
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
                            <input type="text" id="orgAccount" value={org.orgAccount} onChange={chgOrg}/>
                        </td>
                    </tr>
                    <tr>
                        <th>단체 홈페이지 URL</th>
                        <td>
                            <input type="text" id="orgUrl" value={org.orgUrl} onChange={chgOrg}/>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan={2}>
                            <button type="submit">수정</button>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </form>
    )
}

/*이메일 관련 코드*/
function MemberEamil(props){
    const org = props.org;
    const setOrg = props.setOrg;
    const orgEmailId = props.orgEmailId;
    const setOrgEmailId = props.setOrgEmailId;
    const orgEmailDomain = props.orgEmailDomain;
    const setOrgEmailDomain = props.setOrgEmailDomain;
    const setEmailChk = props.setEmailChk;
    
    const [isCustom, setIsCustom] = useState(true);
    
    //이메일 아이디 작성 시 onChange 호출
    function chgEmailId(e){
        setOrgEmailId(e.target.value);
    }

    //도메인 변경 시 호출 함수
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
    
    //직접 입력 선택 후 작성 시 onChange 호출
    function chgEmailDomain(e){
        if (isCustom) {
            setOrgEmailDomain(e.target.value);
        }
    }

    //값 변경 시 State 변수에 저장
    useEffect(function(){
        if(orgEmailId && orgEmailDomain){
            const orgEmail = orgEmailId + "@" + orgEmailDomain;
            setOrg({...org, orgEmail : orgEmail});
        }
    }, [orgEmailId, orgEmailDomain]);

    //유효성 검사
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
            <input type="text" id="orgEmail" value={orgEmailId} onChange={chgEmailId}/>@
            <input type="text" id="orgEmailDomain" value={orgEmailDomain} onChange={chgEmailDomain} readOnly={!isCustom}/>
            <select name="eamilDomain" onChange={selectEmailDomain} value={isCustom ? "custom" : orgEmailDomain}>
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
    const org = props.org;
    const setOrg = props.setOrg;

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
        //주소 값 State 변수에 저장
        setOrg({...org, orgAddrDetail : e.target.value});
    }

    return (
        <>
            <input type="text" ref={addressRef} value={org.orgAddrMain} placeholder="주소" readOnly/>
            <button type="button" onClick={execDaumPostcode}>주소 찾기</button> <br/>
            <input type="text" ref={detailAddressRef} value={org.orgAddrDetail} onChange={chgAddrDetail} placeholder="상세주소" />
        </>
    )
}