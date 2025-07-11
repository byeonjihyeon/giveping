import { add, format, isAfter, isBefore, min, parse } from "date-fns";
import { useEffect, useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";

//DatePicker(달력) import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";
import ProfileUpdate from "./ProfileUpdate";



//회원 정보 수정 페이지
export default function MemberUpdate(props) {
    //부모 컴포넌트(MemberMain) 추출, sideMenu 재랜더링하고자!
    const mainMember = props.member;
    const setMainMember = props.setMember;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //스토리지에서 회원번호 추출용도 및 회원이름 변경시 재랜더링 하고자!
    const {loginMember, setLoginMember} = useUserStore();


    //화면표출 및 서버에 전송할 회원정보
    const [member, setMember] = useState({
        memberNo: mainMember.memberNo,       //회원번호
        memberId: "",                        //회원아이디
        memberName: "",                      //회원이름
        memberPhone: "",                     //회원전화번호
        memberBirth: "",                     //회원생년월일
        memberEmail: "",                     //회원이메일
        memberAddrMain: "",                  //회원주소
        memberAddrDetail: ""                 //회원상세주소
    });

    //date 타입 input 태그에 최대 선택할수 있는기간을 설정하기 위해 만든 변수
    const today = format(new Date(), 'yyyy-mm-dd');

    //전체 기부카테고리
    const [allCategory , setAllCategory] = useState([]);

    //회원 기존카테고리
    const [prevCategory, setPrevCategory] = useState([]);

    //선택한 카테고리
    const [choseCategory, setChoseCategory] = useState([]);
    

   

    //기존 회원정보 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/' + loginMember.memberNo;
        options.method = 'get'

        axiosInstance(options)
        .then(function(res){

            setMember(res.data.resData);
        })
    },[]);

    //input태그 onChange호출시,
    function updMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    //전체 기부카테고리 조회
    useEffect(function(){
        const options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setAllCategory(res.data.resData);
        })
    },[])

    //회원의 기존 관심카테고리 조회
    useEffect(function(){
        const options = {};
        options.url = serverUrl + '/member/category/' + loginMember.memberNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setPrevCategory(res.data.resData);
            setChoseCategory([...res.data.resData]);
        });

    },[])

    //유효성 불통과시 보여줄 메시지 변수
    const [invalidMsg, setInvalidMsg] = useState({
        id : "",
        birth : "",
        phone : "",
        email : ""

    })
    
    //각 입력값 유효성 통과 여부 true : 통과
    const [chkInfo, setChkInfo] = useState({
        id : true,
        birth : true,
        phone : true,
        email : true
    })

    //이름 유효성 검사 (on blur)
    function chkName(e){
        setChkInfo({...chkInfo, id: false});
        setInvalidMsg({...invalidMsg, id: ""});
        
        let name = e.target.value;

        if(name.length == 0){   //아무입력도 안했을때
            setInvalidMsg({...invalidMsg, id: "이름은 필수 정보입니다."});
        }else { //입력후 유효성검사
            //이름 정규표현식
            const regExp = /^[가-힣]{2,10}$/; //이름은 한글 2~10글자
           
            if(!regExp.test(name)){
                setInvalidMsg({...invalidMsg, id: "이름은 한글 2 ~ 10글자 입니다."})
           }else{
                setChkInfo({...chkInfo, id: true});
                setInvalidMsg({...invalidMsg, id: ""});
           }
        }
    }

    //생년월일 유효성 검사 (on blur)
    function chkBirth(e){
        setChkInfo({...chkInfo, birth: false});
        setInvalidMsg({...invalidMsg, birth: ""});

        let birthStr = e.target.value; //"19900101"

        if(birthStr.length == 0){
            setInvalidMsg({...invalidMsg, birth: "생년월일은 필수 정보입니다."});
            return;
        }

        let regExp = /^\d{8}$/;     //숫자로만 8자리
        if(!regExp.test(birthStr)){
            setInvalidMsg({...invalidMsg, birth: "생년월일은 8자리 숫자로 입력해 주세요."});
            return;
        }

        let birth = parse(birthStr, 'yyyyMMdd', new Date()); //parse : 문자열 -> Date (date-dns 제공함수)
        let maxDate = new Date();   //현재 날짜(최대입력날짜)
        let minDate = new Date('1900-01-01'); //(최소입력날짜 1990-01-01)

        //isBefore(d1,d2) == d1이 d2보다 이전인지?
        //isAfter(d1,d2) == d1이 d2보다 이후인지?
        if(isBefore(birth, maxDate) && isAfter(birth, minDate)){ //생일이 조건에 충족한다면,
            let customBirth = birthStr.substring(0,4) + "-" + birthStr.substring(4,6) + "-" + birthStr.substring(6);
            setMember({...member, memberBirth: customBirth});

            setChkInfo({...chkInfo, birth: true});
            setInvalidMsg({...invalidMsg, birth: ""});

        }else{ //충족하지 않는다면,
            setChkInfo({...chkInfo, birth: false});
            setInvalidMsg({...invalidMsg, birth: "생년월일이 정확한지 확인해주세요."});
        }
    }

    //전화번호 유효성 검사 (on blur)
    function chkPhone(e){
        setChkInfo({...chkInfo, phone: false});
        setInvalidMsg({...invalidMsg, phone: ""});

        let phone = e.target.value;

        if(phone.length == 0){
            setInvalidMsg({...invalidMsg, phone: "휴대전화번호는 필수 정보입니다."});
        }else{
            const regExp =/^01[016789]-?\d{3,4}-?\d{4}$/; //하이픈 유무 관계없이 검사
            
            if(!regExp.test(phone)){    //유효성 통과 X
                setInvalidMsg({...invalidMsg, phone: "휴대전화번호가 정확한지 확인해 주세요."});
            }else{ //유효성 통과 
                if(!phone.includes("-")){ //하이픈이 포함되어있지 않다면, "-" 추가해주기
                
                    let custom = "";

                    if(phone.length == 10){ //"0101234567"
                        custom = phone.substring(0,3) + "-" + phone.substring(3,6) + "-" + phone.substring(6); //010-123-4567
                        setMember({...member, memberPhone: custom});
                    }else{  //"01012345678"
                        custom = phone.substring(0,3) + "-" + phone.substring(3,7) + "-" + phone.substring(7); //010-123-4567
                        setMember({...member, memberPhone: custom});
                    }
                }

                setChkInfo({...chkInfo, phone: true});
                setInvalidMsg({...invalidMsg, phone: ""});
            }   
        }
    }

    //이메일 유효성 검사 (on blur)
    function chkEmail(e){
        setChkInfo({...chkInfo, email: false});
        setInvalidMsg({...invalidMsg, email: ""});

        let email = e.target.value;
        
        if(email.length == 0){
            setInvalidMsg({...invalidMsg, email: "이메일은 필수정보입니다."});
        }else{
            const regExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/; //이메일 정규표현식
            
            if(!regExp.test(email)){  // 유효성 x
                setInvalidMsg({...invalidMsg, email: "이메일주소가 정확한지 확인해 주세요."});
            }else{  //유효성 통과
                setChkInfo({...chkInfo, email: true});
                setInvalidMsg({...invalidMsg, email: ""});
            }
        }
    }

    //수정하기 버튼 클릭시 동작함수
    function updateMember(){

        //유효성 확인여부객체인 chkInfo를 순회하여 하나라도 false라면, return.
        for(let chk in chkInfo){
            if(!chkInfo[chk]){
                alert('다시 확인하여주세요');
                return;
            }
        }
    
        //삭제할 카테고리 : 기존카테고리 - 현재카테고리
        const delCategory = prevCategory.filter(function(code,index){return !choseCategory.includes(code)});
        //추가할 카테고리 : 현재카테고리 - 기존카테로기
        const addCategory = choseCategory.filter(function(code,index){return !prevCategory.includes(code)});
        
        let options = {};
        options.url = serverUrl + '/member';
        options.method = 'patch';   //수정
        options.data = {
                        member: member,
                        addCategory: addCategory,
                        delCategory: delCategory        
                        }
       
        axiosInstance(options)
        .then(function(res){
            if(member.memberName != loginMember.memberName){                        //이름이 변경되었다면, 스토리지변수 또한 변경
                setLoginMember({...loginMember, memberName: member.memberName});    //스토리지영역도 변경적용 및 헤더, 사이드메뉴 재랜더링
                setMainMember({...mainMember, memberName: member.memberName})
            }
            
            if(member.memberEmail != mainMember.memberEmail){
                setMainMember({...mainMember, memberEmail: member.memberEmail});
            }
        })
    }

    return (
        <div className="update-frm-wrap">
            <div className="update-frm-title">회원정보 수정</div>
            <div className="update-frm-content" >
                <div className="input-wrap">
                    <div className="input-title-wrap">프로필</div>
                    <ProfileUpdate member={mainMember} setMember={setMainMember} />
                </div>
                <div className="input-wrap">
                    <div className="input-title-wrap">이름</div>
                    <div className="input-content-wrap">
                        <input type="text" id='memberName' value={member.memberName} onChange={updMember} onBlur={chkName} />   
                        <p className={chkInfo.id ? "" : "invalid"}> {invalidMsg.id}</p>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title-wrap">생년월일</div>
                    <div className="input-content-wrap">
                        <input type='type' id='memberBirth' value={member.memberBirth} placeholder="생년월일 8자리" onChange={updMember} onBlur={chkBirth}/>
                        <p className={chkInfo.birth ? "" : "invalid"}> {invalidMsg.birth}</p>
                    </div>
                
                </div>
                <div className="input-wrap">
                    <div className="input-title-wrap" >전화번호</div>
                    <div className="input-content-wrap">
                        <input type="text" id='memberPhone' value={member.memberPhone} onChange={updMember} onBlur={chkPhone}/>
                        <p className={chkInfo.phone ? "" : "invalid"}>{invalidMsg.phone}</p>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title-wrap">이메일</div>
                    <div className="input-content-wrap">
                        <input type="text" id='memberEmail' maxLength={100} value={member.memberEmail} onChange={updMember} onBlur={chkEmail}/>
                        <p className={chkInfo.email ? "" : "invalid"}>{invalidMsg.email}</p>
                    </div>   
                </div>
        
                <div className="input-wrap">
                    <div className="input-title-wrap">주소</div>
                    <MemberAddr member={member} setMember={setMember} />
                
                </div>
                <div className="input-category-wrap">
                    <div className="input-category-title-wrap">
                        <img src="/images/check_box_30dp_5985E1.png" />
                        <span>관심 카테고리를 선택하시면 원하는 정보를 더 빠르게 찾을 수 있어요!</span>
                    </div>
                    <div className="category-wrap">
                        {allCategory.map(function(category, index){
                            
                            function chkCategory(e){
                                let divEl = e.target;
                                if(divEl.classList.contains('chosed-category')){     //선택 헤제시   
                                        divEl.classList.remove('chosed-category');
                                        setChoseCategory(choseCategory.filter(function(dCode,dIndex){
                                            return category.donateCode != dCode;
                                        }))
                                }else {  //선택시
                                        divEl.classList.add('chosed-category');
                                        if(!choseCategory.includes(category.donateCode)){
                                            setChoseCategory([...choseCategory, category.donateCode]);
                                        }
                                }    
                            }
                            return <div key={"category" + index} id={category.donateCode} className={"category-name" + (prevCategory.includes(category.donateCode) ? " chosed-category" : "")} onClick={chkCategory} >{category.donateCtg}</div>
                        })}
                    </div>
                </div>               
            </div>
            <div className="update-btn-wrap">
                    <button type="button" onClick={updateMember}>수정하기</button>
            </div>
             <div className="delete-wrap">
                <span>탈퇴를 원하시면 우측의 회원탈퇴 버튼을 눌러주세요.</span>        
                <button><Link to='/member/delete'>탈퇴하기</Link></button>
            </div>
        </div>
    )
}

//주소 찾기 (카카오 API)
function MemberAddr(props){
    const member = props.member;
    const setMember = props.setMember;

    //카카오 기본주소 입력완료후, 상세창으로 이동하기 위해 사용
    const detailAddrEl = useRef(null);

    //상세주소 onChange 발동시
    function updAddr(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

     function DaumPostcode() {
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                } 

                //주소 정보를 해당 필드에 넣는다.
                member['memberAddrMain'] = addr; 
                setMember({...member});

                // 커서를 상세주소 필드로 이동한다.
                detailAddrEl.current.focus();
            }
        }).open();
    }

    return (
        <div className="input-addr-wrap">
            <input id='addr-btn' type="button" onClick={DaumPostcode} value="주소 찾기" /> <br/>
            <input type="text" id="memberAddrMain" placeholder="주소" value={member.memberAddrMain} readOnly /> <br/>
            <input type="text" id="memberAddrDetail" placeholder="상세주소" maxLength={30} value={!member.memberAddrDetail ? "" : member.memberAddrDetail} ref={detailAddrEl} onChange={updAddr} />
        </div>
    )
}