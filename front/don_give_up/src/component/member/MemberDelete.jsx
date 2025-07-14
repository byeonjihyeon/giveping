import { useNavigate } from "react-router-dom"
import useUserStore from "../../store/useUserStore";
import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";

export default function MemberDelete(props){
    const mainMember = props.member //MemberMain 부모컴포넌트에서 추출
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    //회원탈퇴후 초기화를 위해 스토리지변수 선언
    const {setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken } = useUserStore();
    //탈퇴 동의여부 state변수
    const [isAgreed, setIsAgreed] = useState(false);

    //회원번호, 비밀번호 state 변수
    const [member, setMember] = useState({
        memberNo: loginMember.memberNo,
        memberPw : ""
    })

    //환불요청중인 리스트를 관리할 변수
    const [refundList, setRefundList] = useState([]);

    //비밀번호 확인여부 state변수
    const [isAuth, setIsAuth] = useState(false);

    //출금요청중인 리스트 조회
    useEffect(function(){
        const options = {};
        options.url = serverUrl + '/member/refund/' + loginMember.memberNo;
        options.method= 'get';

        axiosInstance(options)
        .then(function(res){
            setRefundList(res.data.resData);
        })

    }, [])

    //체크박스 onChange
    function chkAgree(e){
        setIsAgreed(e.target.checked);
    }

    //비밀번호 input onChange
    function chgPw(e){
        member.memberPw = e.target.value;
        setMember({...member});
    }

    //확인(비밀번호)버튼 클릭시, 동작함수
    function chkPw(){

        let options = {};
        options.url = serverUrl + '/member/checkPw';
        options.method = 'post';
        options.data = member;
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setIsAuth(true);
            }else{
                alert('비밀번호를 다시 확인하여주세요.');
            }
        })
    }
    //탈퇴버튼 클릭후, 메인화면으로 이동하기 위한
    const navigate = useNavigate();

    //탈퇴버튼 클릭시 동작함수
    function deleteMember(){
        if(refundList != null && refundList.length > 0){
            alert('출금 완료후에 탈퇴진행 가능합니다.');
            return;
        }


        let options = {};
        options.url = serverUrl + '/member/delete/' + loginMember.memberNo;
        options.method = 'patch'    //회원 탈퇴 여부(0 : 정상, 1 : 탈퇴) -> 회원의 기부 내역을 보존하고자
        
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                //스토리지 정보 초기화
                setIsLogined(false);
                setLoginMember(null);
                setAccessToken(null);
                setRefreshToken(null);
                navigate('/login');
            
            }
        })
    }
    return(
        <div className="member-delete-wrap">
            <div className="title">회원탈퇴</div>
            <div className="notice">
                <span>회원탈퇴 전, 유의사항을 확인해 주시기 바랍니다.</span>
                <span>- 회원탈퇴 시 회원전용 웹 서비스 이용이 불가합니다.</span>
                <span>- 거래정보가 있는 경우, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의  &nbsp;&nbsp;공급에 관한 기록은 5년동안 보존됩니다.</span>
                <span>- 보유하셨던 금액은 탈퇴와 함께 삭제되며 환불되지 않습니다.</span>
                <span>- 회원탈퇴 후 서비스에 입력하신 댓글은 삭제되지 않으며, 회원정보 삭제로 인해 작성자 본인을 확인할 수 없어 편집 및 삭제처리가 &nbsp;&nbsp;원천적으로 불가능 합니다.
                상품문의 및 후기, 댓글 삭제를 원하시는 경우에는 먼저 댓글을 삭제하신 후 탈퇴를 신청하시기 바랍니다.</span>
                <span>- 이미 결제가 완료된 건은 탈퇴로 취소되지 않습니다.</span>
            </div>
            <div className="notice-agree">
             <input type="checkbox" checked={isAgreed} onChange={chkAgree}/> 상기 회원탈퇴 시 처리사항 안내를 확인하였음에 동의합니다.
            </div>
            <div className="money-info">
                <div>
                    <div>현재 보유금액</div>
                    <div>{mainMember.totalMoney} 원</div>
                </div>
                <div className="refund-ing">
                    <div className="title">
                        <span>출금 진행중인 건</span>
                        <span className="invalid"> 모두 완료해야 탈퇴 가능합니다.</span></div>
                    <div className="category">
                        <div>구분</div>
                        <div>금액</div>
                        <div>요청일</div>
                    </div>
                    {refundList != null && refundList.length != 0 ?
                        refundList.map(function(refund, index){
                            return <div className="info">
                                        <div>{index + 1}</div>
                                        <div>{refund.refundMoney} 원</div>
                                        <div>{refund.refundDate}</div>
                                   </div>
                        })
                    :
                    ""
                   
                    }
                </div>
            </div>
            <div className="delete-agree">
                <div>회원님의 이름과 계정 및 비밀번호를 확인 합니다.</div>
                <div className="member-info">
                    <div className="title">
                        <div>이름 : </div>
                        <div>{mainMember.memberName}</div>
                    </div>
                    <div className="title">
                        <div>아이디 : </div>
                        <div>{mainMember.memberId}</div>
                    </div>
                    <div>
                        <div>비밀번호 : </div>
                        <input type='password' value={member.memberPw} onChange={chgPw} disabled={isAuth} /> 
                        <button type='button' onClick={chkPw} disabled={isAuth}>본인확인</button>
                    </div>
                </div>
            </div>
            {
            <div className="btn">
                <button type="button" onClick={deleteMember} disabled={!isAgreed || !isAuth}>탈퇴하기</button>
            </div>
            }
        </div>     
    )
}