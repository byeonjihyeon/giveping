import { Link } from "react-router-dom";
import { useState } from "react"
import Modal from "../common/Modal";
import ChargeFrm from "../common/ChargeFrm";
import RefundFrm from "../common/RefundFrm";


export default function MyHome(props){
    const member = props.member;
   
    //모달창 상태
    const [modalType, setModalType] = useState(null); //'charge' or 'refund' or 'null'

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
                            <button className="charge-btn" onClick={function(){
                                setModalType('charge');                        
                            }} >충전</button>
                            <button className="refund-btn" onClick={function(){
                                setModalType('refund');
                            }}>출금</button>
                            <Modal title={"충전하기"} isOpen={modalType !== null} onClose={function(){
                                setModalType(null);
                            }}>

                            {modalType === 'charge' ?
                            <ChargeFrm onClose={setModalType}  />
                            :
                            modalType === 'refund' ?
                            <RefundFrm />
                            :
                            ""
                            }
                            </Modal>                     
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    )
}



