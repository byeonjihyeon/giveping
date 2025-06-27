import { Link, useNavigate } from "react-router-dom";

//개인 회원 회원가입 페이지
export default function MemberJoin(){
    const navigate = useNavigate();

    return (
        <section className="section join-wrap">
            <div className="page-title">개인 회원가입</div>
            <form>
                <div>
                    <label htmlFor="memberId">아이디</label>
                    <input type="text" id="memberId"/>
                    <button>중복체크</button>
                    <p>아이디 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="memberPw">비밀번호</label>
                    <input type="password" id="memberPw"/>
                    <p>비밀번호 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="memberPwRe">비밀번호 확인</label>
                    <input type="password" id="memberPwRe"/>
                    <p>비밀번호와 일치하지 않습니다.</p>
                </div>
                <div>
                    <label htmlFor="memberName">이름</label>
                    <input type="text" id="memberName"/>
                </div>
                <div>
                    <label htmlFor="memberPhone">전화번호</label>
                    <input type="text" id="memberPhone"/>
                </div>
                <div>
                    <label htmlFor="memberEmail">이메일</label>
                    <input type="text" id="memberEmail"/>@
                    <input type="text" id="memberEmailDomain"/>
                    <select name="eamilDomain">
                        <option value="none">직접 입력</option>
                        <option value="naver">naver.com</option>
                        <option value="daum">daum.net</option>
                        <option value="kakao">kakao.net</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="memberAddr">주소</label>
                    <input type="text" id="memberAddr" readOnly/>
                    <button>주소 검색</button>
                    <input type="text" id="memberAddrDetail"/>
                </div>
                <div>
                    <button onClick={function(){
                        navigate("/join/category");
                    }}>다음</button>
                </div>
            </form>
        </section>
    )
}