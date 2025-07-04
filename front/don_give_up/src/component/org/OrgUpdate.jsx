import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useRef, useState } from "react";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//단체 정보 수정
export default function OrgUpdate(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const mainOrg = props.org;
    const setMainOrg = props.setOrg;

    //단체 번호를 가져오기 위함
    const {loginOrg} = useUserStore();

    //단체 1개 정보를 저장할 State 변수
    const [org, setOrg] = useState({
        orgNo : "", orgId : "", orgName : "", orgBiznum : "", orgPhone : "", orgEmail : "", orgAddrMain : "",
        orgAddrDetail : "", orgIntroduce : "", orgAccount : "", orgAccountBank : "", orgUrl : "", categoryList : []
    });

    const [donateCtgList, setDonateCtgList] = useState([]); //DB에서 조회한 카테고리 리스트를 저장할 State 변수
    const [checkCtgList, setCheckCtgList] = useState([]);   //체크한 카테고리 정보를 저장할 State 변수

    //이메일 정보를 저장할 State 변수
    const [orgEmailId, setOrgEmailId] = useState("");
    const [orgEmailDomain, setOrgEmailDomain] = useState("");
    //이메일 유효성 체크 결과를 저장할 변수
    const [emailChk, setEmailChk] = useState(0);

    //단체 1개 정보 가져오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/" + loginOrg.orgNo;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            const newOrg = res.data.resData;
            
            if(!newOrg.orgUrl){
                newOrg.orgUrl = "";
            }

            //이메일 내에서 @를 기준으로 아이디와 도메인 추출
            const [emailId, emailDomain] = newOrg.orgEmail.split("@");
            
            setOrgEmailId(emailId);
            setOrgEmailDomain(emailDomain);

            setCheckCtgList(newOrg.categoryList);

            setOrg(newOrg);
        });
    }, []);

    //카테고리 리스트 정보 가져오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setDonateCtgList(res.data.resData);
        });
    }, []);

    //input 태그 안 내용 변경 시
    function chgOrg(e){
        org[e.target.id] = e.target.value;
        setOrg({...org});
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
            { valid: biznumChk !== 1, message: "사업자번호를 확인하세요.(XXX-XX-XXXXX 형식)" },
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

        let options = {};
        options.url = serverUrl + "/org/update";
        options.method = "patch";
        options.data = org;

        axiosInstance(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            })
            .then(function(result){
                setMainOrg({...mainOrg, orgName : org.orgName, orgEmail : org.orgEmail});
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
                    <tr>
                        <th colSpan={2}>
                            <ul className="select-ctg-wrap">
                                {donateCtgList.map(function(category, index){
                                    return <DonateCtg key={"category"+index} category={category} org={org} setOrg={setOrg}
                                                                             checkCtgList={checkCtgList} setCheckCtgList={setCheckCtgList}/>
                                })}
                            </ul>
                        </th>
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

function DonateCtg(props){
    const category = props.category;
    const org = props.org;
    const setOrg = props.setOrg;
    const checkCtgList = props.checkCtgList;
    const setCheckCtgList = props.setCheckCtgList;

    //카테고리 클릭 시 토글
    function toggleCategory(code) {
        setCheckCtgList(function (prev) {
            if (prev.includes(code)) {
                // 이미 선택된 경우 제거
                return prev.filter(function (item) {
                return item !== code;
                });
            } else {
                // 새로운 선택 추가
                return [...prev, code];
            }
        });
    }

    useEffect(function(){
        setOrg({...org, categoryList : checkCtgList});
    }, [checkCtgList]);

    return (
        <li className={"select-ctg" + (!checkCtgList ? "" : checkCtgList.includes(category.donateCode) ? " active" : "")}
            onClick={function(){ toggleCategory(category.donateCode); }}>
            {category.donateCtg}
        </li>
    )
}