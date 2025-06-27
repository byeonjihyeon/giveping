
//개인 회원 회원가입 페이지
export default function MemberJoin(){

    return (
        <section className="section join-wrap">
            <div className="page-title">개인 회원가입</div>
            <form>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberid"/>
                    </div>
                    <button>중복 체크</button>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberid"/>
                    </div>
                </div>
            </form>
        </section>
    )
}