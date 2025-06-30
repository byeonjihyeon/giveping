import { useState } from "react"

//기부내역 조회 리스트
export default function DonateList(){
    
    /* 
    1. 기부번호 
    2. 사업명
    3. 단체명
    4. 기부일자
    5. 기부액
    6. 기부영수증출력버튼
    */

    const [donateList, setDonateList] = useState([
        {no: 1, biz: '사업1', org:'단체1', date:'2025-06-30', money: 10000},
        {no: 2, biz: '사업2', org:'단체2', date:'2025-06-30', money: 50000},
        {no: 3, biz: '사업3', org:'단체3', date:'2025-06-30', money: 100000},
        {no: 4, biz: '사업4', org:'단체4', date:'2025-06-30', money: 3000},
        {no: 5, biz: '사업5', org:'단체5', date:'2025-06-30', money: 100000}
    ]);
    
    return (
        <div className="member-donate-list-wrap-out">
            <div className="member-donate-period">
                <p>캘린더 ~ 캘린더</p>
            </div>
            <div className="donate-list-wrap-in">
                {donateList.map(function(donate,index){
                    return <OneDonate key={"donate" + index} donate={donate} />
                })}
            </div>
        </div>
    )
}

function OneDonate(props){

    const donate = props.donate;

    return (
       <div className="donate-info-wrap">
            <div className="state-wrap">
                <div className="state">
                    <span>기부 완료</span>
                </div>
            </div>
            <div className="donate-info">
                <div>{donate.date}</div>
                <div>{donate.biz}</div>
                <div>{donate.org}</div>
            </div>
            <div className="donate-money">
                <span>{donate.money}원</span>
                <button type="button">영수증 출력</button>
            </div>
       </div> 
    )
}

