import { format } from "date-fns";
import { useEffect, useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";

//DatePicker(달력) import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



//회원 정보 수정 페이지
export default function MemberUpdate() {
   
    /* 
        회원 번호, 프로필사진, 이름, 전화번호, 생일, 주소, 관심카테고리를 입력받아 서버로 전송!
    */
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


    //회원 (서버 전송용)
    const [member, setMember] = useState({
        memberNo: "1",                                                               //회원 번호           
        memberProfile: "",                                                           //회원 프로필사진(객체)    
        memberName: "변지현",                                                         //회원 이름
        memberPhone: "010-1234-1234",                                                //회원 전화번호
        memberBirth: "2005/01/01",                                                   //회원 생년원일
        memberAddr: "경기도 광주시 탄벌동 무슨 아파트 무슨 동 무슨 호",                    //회원 주소
        donateCategory: ['D02','D05', 'D06' ],                                       //회원 관심 카테고리
        delCategoryCodes : [],                                                    //기존 관심카테고리 취소할 코드 리스트
        addCategoryCodes : []                                                 //추가할 관심카테고리 코드 리스트
    });

    //전체카테고리 
    const [categoryList, setCategoryList] = useState([]);

    //전체 카테고리 리스트 서버에 요청
    useEffect(function(){
         let options = {};
        options.url = serverUrl + '/donateCtg';
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setCategoryList(res.data.resData);      
        })
    },[])
    
    //썸네일 이미지 미리보기용 변수 (서버에 전송x)
    const [profileImg, setProfileImg] = useState(null);
    
    //input type=file인 프로필 사진 업로드 요소와 연결하여 사용.
    const profileFileEl = useRef(null);
    
    //파일 미리보기 호출
    function chgProfileImg(e){
        const files = e.target.files;

        if(files.length != 0 && files[0] != null){
            setMember({...member, memberProfile: files[0]});
            
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function(){
                setProfileImg(reader.result);
                }
        }else {
            //업로프 팝업 취소한 경우, 프로필 사진 객체와 미리보기용 변수 초기화
            setMember({...member, memberProfile: null});
            setProfileImg(null);
        }
        
    }

    function updMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }




    return (
        <div className="member-update-frm-wrap">
           <form>
                <table border={1}>
                    <tbody>
                        <tr>
                            <th className="profileImg-wrap" colSpan={2}>
                                {profileImg ? 
                                    <img src={profileImg} onClick={function(e){
                                        profileFileEl.current.click();
                                    }} />
                                :
                                    <img src="/images/default_profile.jpg" onClick={function(e){
                                        profileFileEl.current.click();
                                    }}/>
                                    
                                }
                                <input type="file" accept="image/*" style={{display: 'none'}} ref={profileFileEl} onChange={chgProfileImg}  />
                            </th>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td>{member.memberNo}</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input type="text" id='memberName' value={member.memberName} onChange={updMember} />
                                <p>이름 유효성 확인 메시지</p>
                            </td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>
                                <input type="text" id='memberPhone' value={member.memberPhone} onChange={updMember} />
                                <p>전화번호 유효성 확인 메시지</p>
                            </td>
                        </tr>
                         <tr>
                            <th>생년월일</th>
                            <td>
                                <DatePicker
                                    dateFormat="yyyy/MM/dd"             //날짜포맷
                                    minDate={new Date('1900-01-01')}    //1900-01-01 전은 선택불가
                                    maxDate={new Date()}                //당일 이후 날짜 선택불가
                                    selected={member.memberBirth}
                                    onChange={(date) => {
                                        date = format(date, 'yyyy/MM/dd');  ///포맷변경, date-fns 라이브러리 설치해야 사용가능함수!
                                        setMember({...member, memberBirth: date});
                                    }}
                                    //selected={selectedDate}
                                    //onChange={(date) => setSelectedDate(date)}
                                />        
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <FindAddr member={member} setMember={setMember} />
                        </tr>
                        <tr>
                            <th>관심 카테고리</th>
                            <td>
                              {categoryList.map(function(category, index){

                                    function chgCategory(e){
                                        if(e.target.checked){
                                            member.donateCategory.push(e.target.value);
                                            
                                            if(!member.addCategoryCodes.includes(e.target.value)){ 
                                                
                                            }        
                                            
                                            setMember({...member});
                                            

                                        }else{
                                          if(member.donateCategory.includes(category.donateCode)){
                                            let delNo = member.donateCategory.indexOf(category.donateCode);
                                            member.donateCategory.splice(delNo, 1);  





                                            setMember({...member});
                                          
                                          }
                                        }
                                    }

                                    return  <div key={"category" + index}>
                                                <input 
                                                       value={category.donateCode}
                                                       type='checkbox'
                                                       checked={member.donateCategory.includes(category.donateCode)}
                                                       onChange={chgCategory}
                                                         /> 
                                                <label>{category.donateCtg}</label> 
                                            </div>
                              })}

                            </td>
                        </tr>
                        <tr>
                            <th colSpan={2}>
                                <input type="submit" value='수정' />
                                <button type="button" onClick={function(){
                                    console.log(member);
                                }}>서버전송 확인용</button>
                            </th>
                        </tr>
                    </tbody>
                </table>              
           </form>
        </div>
    )
}

//주소창 컴포넌트
function FindAddr(props){
    const member = props.member;
    const setMember = props.setMember;

    //주소찾기 클릭완료후, 상세주소창으로 이동시키기 위해 사용.
    const detailAddrEl = useRef(null);
    
    const [addr, setAddr] = useState(member.memberAddr);
    const [detailAddr, setDetailAddr] = useState("");

    //상세주소창 onChang호출
    function updDetailAddr(e){
        setDetailAddr(e.target.value);
    }

    //상세주소창 onBlur호출시 부모컴포넌트 setMember
    function updAddr(){
        setMember({...member, memberAddr: addr + " " + detailAddr});
    }
    
    //카카오 주소찾기 함수
    function findAddr() {

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
                setAddr(addr + extraAddr);
               
                // 커서를 상세주소 필드로 이동한다.
                detailAddrEl.current.focus();
            }
        }).open();
    }

    return (
        <td>
            <input type="button" onClick={findAddr} value="주소 찾기"/> <br/>
            <input type="text" placeholder="주소" value={addr} readOnly/>
            <input type="text" placeholder="상세주소" value={detailAddr} ref={detailAddrEl} onChange={updDetailAddr} onBlur={updAddr}/>
        </td>
    )
}