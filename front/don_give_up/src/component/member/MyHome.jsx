import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import Modal from "../common/Modal";
import ChargeFrm from "../common/ChargeFrm";
import RefundFrm from "../common/RefundFrm";
import Swal from "sweetalert2";


export default function MyHome(props){
    const member = props.member;
    const setMember = props.setMember;
   
    //모달창 상태
    const [modalType, setModalType] = useState(null); //'charge' or 'refund' or 'null'

    const navigate = useNavigate();

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
                            <div className="refund-btn" onClick={function(){
                                if(member.memberBankCode == '0'){
                                    Swal.fire({     //등록된 계좌가 없을경우
                                        title : '알림',
                                        text : '등록된 계좌가 없습니다. 인증 페이지로 이동할까요?',
                                        icon : 'warning',
                                        showCancelButton: true,
                                        confirmButtonText: '이동하기',
                                        cancelButtonText: '취소'
                                    }).then(function(res){
                                        if(res.isConfirmed){
                                            navigate('/member/accountInfo');
                                        }
                                    })
                                    return;
                                }
                                setModalType('refund');
                            }}>출금신청</div>

                            <Modal modalType={modalType} isOpen={modalType !== null} onClose={function(){
                                setModalType(null);
                            }}>
                                {modalType === 'charge' ?
                                <ChargeFrm onClose={setModalType} member={member} setMember={setMember}  />
                                :
                                modalType === 'refund' ?
                                <RefundFrm onClose={setModalType} member={member} setMember={setMember} title='출금신청'/>
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



