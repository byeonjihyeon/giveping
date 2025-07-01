import { add } from "date-fns";
import { useRef, useState } from "react"

//DatePicker(달력) import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


//회원 정보 수정 페이지
export default function MemberUpdate() {
   
    //회원 (서버 전송용)
    const [member, setMember] = useState({
        memberNo: "",                   //회원 번호           
        memberThumb: "",                //회원 썸네일    
        memberName: "",                 //회원 이름
        memberPhone: "",                //회원 전화번호
        memberBirth: "",                //회원 생년원일
        memberAddr: "",                 //회원 주소
        donateCategory: ""              //회원 관심 카테고리
    });

    //썸네일 이미지 미리보기용 변수 (서버에 전송x)
    const [thumbImg, setThumbImg] = useState(null);
    
    //input type=file인 썸네일 업로드 요소와 연결하여 사용.
    const thumbFileEl = useRef(null);
    
    //생년월일
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    //주소
    const [memberAddr, setMemberAddr] = useState("");

    return (
        <div className="member-update-frm-wrap">
           <form>
                <table border={1}>
                    <tbody>
                        <tr>
                            <th colSpan={2}>
                                <img src="/images/default_profile.jpg" onClick={function(e){
                                    thumbFileEl.current.click();
                                }}/>
                                <input type="file" accept="image/*" ref={thumbFileEl}  />
                            </th>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td>byeonchoco</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input type="text" name='memberName' />
                                <p>이름 유효성 확인 메시지</p>
                            </td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>
                                <input type="text" name='memberName' />
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
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                />        
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <FindAddr memberAddr={memberAddr} setMemberAddr={setMemberAddr} />
                        </tr>
                        <tr>
                            <th>관심 카테고리</th>
                            <td>
                            
                            </td>
                        </tr>
                        <tr>
                            <th colSpan={2}>
                                <input type="submit" value='수정' />
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
    const memberAddr = props.memberAddr;
    const setMemberAddr = props.setMemberAddr;

    //상세주소 제외한 주소값
    const [iuputAddr , setInputAddr] = useState("");
    
    //상세주소 입력창 요쇼
    const detailAddrEl = useRef(null);

    //상세주소 입력시 호출 함수 == onChange
    function updDetailAddr(e){
        if(iuputAddr != null && iuputAddr != ""){   //기본주소값이 작성된 경우에만
            setMemberAddr(iuputAddr + " " + e.target.value);
        }
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
                setInputAddr(addr + extraAddr);
                // 커서를 상세주소 필드로 이동한다.
                detailAddrEl.current.focus();
            }
        }).open();
    }

    return (
        <td>
            <input type="button" onClick={findAddr} value="우편번호 찾기"/> <br/>
            <input type="text" id="address" placeholder="주소" value={iuputAddr} readOnly />
            <input type="text" id="detailAddress" placeholder="상세주소" ref={detailAddrEl} onChange={updDetailAddr} />
       </td>
    )
}