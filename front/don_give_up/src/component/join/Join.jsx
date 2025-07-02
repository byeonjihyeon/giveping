import { useEffect } from "react";
import { Link } from "react-router-dom";

//회원가입 페이지
export default function Join(props){
    const setMember = props.setMember;
    const member = {
        memberId : "", memberPw : "", memberName : "", memberPhone : "",
        memberBirth : "", memberEmail : "", memberAddr : ""
    }

    //개인 회원가입 페이지에서 나왔을 때 저장된 멤버값 초기화
    useEffect(function(){
        setMember(member);
    }, []);

    return (
        <section className="section join-wrap">
            <div className="page-title">회원가입</div>
            <div className="join-select">
                <Link to="/join/member">개인 회원가입</Link>
                <Link to="/join/org">단체 회원가입</Link>
            </div>
        </section>
    )
}