
//단체 회원 회원가입 페이지
export default function OrgJoin(){

    return (
        <section className="section join-wrap">
            <div className="page-title">단체 회원가입</div>
            <form>
                <div>
                    <label htmlFor="orgId">아이디</label>
                    <input type="text" id="orgId"/>
                    <button>중복체크</button>
                    <p>아이디 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="orgPw">비밀번호</label>
                    <input type="password" id="orgPw"/>
                    <p>비밀번호 유효성 체크 결과 문구</p>
                </div>
                <div>
                    <label htmlFor="orgPwRe">비밀번호 확인</label>
                    <input type="password" id="orgPwRe"/>
                    <p>비밀번호와 일치하지 않습니다.</p>
                </div>
                <div>
                    <label htmlFor="orgName">단체명</label>
                    <input type="text" id="orgName"/>
                </div>
                <div>
                    <label htmlFor="orgBiznum">사업자 번호</label>
                    <input type="text" id="orgBiznum"/>
                </div>
                <div>
                    <label htmlFor="orgPhone">전화번호</label>
                    <input type="text" id="orgPhone"/>
                </div>
                <div>
                    <label htmlFor="orgEmail">이메일</label>
                    <input type="text" id="orgEmail"/>@
                    <input type="text" id="orgEmailDomain"/>
                    <select name="eamilDomain">
                        <option value="write">직접 입력</option>
                        <option value="naver">naver.com</option>
                        <option value="daum">daum.net</option>
                        <option value="kakao">kakao.net</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="orgAddr">주소</label>
                    <input type="text" id="orgAddr" readOnly/>
                    <button>주소 검색</button>
                    <input type="text" id="orgAddrDetail"/>
                </div>
                <div>
                    <label htmlFor="orgIntroduce">단체 설명</label>
                    <input type="text" id="orgIntroduce"/>
                </div>
                <div>
                    <label htmlFor="orgAccount">계좌번호</label>
                    <select name="orgAccountBank" id="orgAccountBank">
                        <option value="bank">--선택--</option>
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
                    <input type="text" id="orgAccount"/>
                </div>
                <div>
                    <button>다음</button>
                </div>
            </form>
        </section>
    )
}