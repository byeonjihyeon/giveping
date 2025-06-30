import { useRef, useState } from "react"

//회원 정보 수정 페이지
export default function MemberUpdate() {

    //썸네일 이미지 미리보기용 변수 (서버에 전송x)
    const [thumbImg, setThumbImg] = useState(null);

    //input type=file인 썸네일 업로드 요소와 연결하여 사용.
    const thumbFileEl = useRef(null);



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
                                <input type="text" name='memberName' />
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <input type="text" name='memberName' />
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