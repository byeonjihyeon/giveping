
//회원 비밀번호 변경 페이지
export default function MemberChangePw(){
    return (
        //현재 비밀번호 입력창
        <div>        
            <div>
                <span>현재비밀번호</span>
                <input type="password" name='memberPw' />
                <button type="button">확인</button>
            </div>

        {/* 새 비밀번호 입력창 */}
            <div>
                <span>변경할 비밀번호</span>
                <input type="text" name='memberNewPw' />
            </div>
            <div>
                <span>비밀번호 확인</span>
                <input type="password" name='memberRePw' />
                <button type="button">변경</button>
                <p>비밀번호 일치여부 확인 메시지</p>
            </div>
        </div>
        
    )
}