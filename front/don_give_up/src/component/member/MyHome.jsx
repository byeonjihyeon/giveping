import { Link } from "react-router-dom";

export default function MyHome(props){
    const member = props.member;

    return (
        <div className="myHome-wrap">
            <div className="myHome-wrap-top">
                <div className="top-info">
                    <div className="detail-left">
                        <div>총 기부금</div>
                    </div>    
                    <div className='detail-right'>
                        <div className="money">
                            <span>{member.totalDonateMoney}</span>
                            <span> 원</span>
                        </div>
                        <div className="donation-cnt">
                            <div>기부횟수</div>
                            <div>{!member.donationHistory ? "" :member.donationHistory.length} 회</div>
                        </div>
                    </div>
                </div>
                <div className="top-info">
                    <div className="detail-left">
                        <div>나의 보유금액</div>
                    </div>    
                    <div className='detail-right'>
                        <div className="money">
                            <span>{member.totalMoney}</span> 
                            <span> 원</span>
                        </div>
                        <div className="chargeOrRefund-btn">
                            <div className="charge-btn">충전</div>
                            <div className="refund-btn">출금</div>
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    )
}