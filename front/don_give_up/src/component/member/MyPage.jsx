import { useState } from "react"

export default function MyPage (){

    
    const [member, setMember] = useState({
        memberId: '',
        memberName: '',
        memberPhone: '',
        memberBirth: '',
        memberEmail: 
        member

    });

    return (
        <div>
            <p>회원 정보 수정</p>
            <input type='text'   />
        </div>
    )
}