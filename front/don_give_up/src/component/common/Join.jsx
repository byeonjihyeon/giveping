import { Link } from "react-router-dom";

//회원가입 페이지
export default function Join(){

    return (
        <section className="section join-wrap">
            <div className="page-title">회원가입</div>
            <div className="join-select">
                <Link to="/member/join">개인 회원가입</Link>
                <Link to="/org/join">단체 회원가입</Link>
            </div>
        </section>
    )
}