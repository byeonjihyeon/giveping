import { useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//출금 컴포넌트
export default function RefundFrm(props){
    const onClose = props.onClose; // ==setModalType
    const member = props.member;
    const setMember = props.setMember;

    //회원버튼 추출 용도
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버 전송용 변수
    const [refund, setRefund] = useState({
        refundMoney : "",
        memberAccount : member.memberBankCode,
        memberAccountBank : member.memberBankAccount
    })


    //숫자 3자리마다 콤마 찍는 함수
    function addCommas(money){
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //금액 , 로 변환해줄 변수
    const [commaMoney , setCommaMoney] = useState("");

    //금액 유효성 메시지
    const [moneyMsg, setMoneyMsg] = useState("");

    //금액 유효성 결과 변수
    const [isMoney, setIsMoney] = useState(false);

    //금액입력 input onChange
    function chgMoney(e){
        let money = e.target.value;

        if(money.indexOf(0) == '0'){    //0으로 입력 불가 제어
            return;
        }

        setCommaMoney(money);
    }

    //금액 유효성 검사
    function chkMoney(e){
        setIsMoney(false);
        setMoneyMsg("");

        let moneyStr = e.target.value;

        if(moneyStr.length == 0){  //금액미입력시
            setMoneyMsg('금액을 입력하여주세요');
            return;
        }
        
        const regExp = /^[0-9]*$/; // 0 ~ 9 숫자 입력만
        if(!regExp.test(moneyStr)){ //숫자 입력 x
            setMoneyMsg('숫자만 입력하여주세요.');
            return;
        }
        
        //원 단위로 포맷변경
        setCommaMoney(addCommas(moneyStr));
        
        let prevMoneyStr = member.totalMoney.split(',').join(''); //현재 금액 1,000,000 => 1000000
        let prevMoney = Number(prevMoneyStr);   //데이터 타입 숫자로 변환
        let money = Number(moneyStr);

        if(prevMoney < money){
            setMoneyMsg('현재 보유하고 있는 금액보다 크게 입력하였습니다.');
            return;
        }
        
        //서버에 전달할 money
        moneyStr.split(',').join(''); //1,000,000 => 1000000
        setIsMoney(true);
        setRefund({...refund, refundMoney: moneyStr });
        
    }


    //출금 신청하기 (유효성 검사 포함)
    function refundMoney(){

        if(!isMoney){   //유효성 검사 미통과시 메소드 종료.
            return;
        }

        let options = {};
        options.url = serverUrl + '/member/refund/' + loginMember.memberNo;
        options.data = refund;
        options.method = 'post';
        
        axiosInstance(options)
        .then(function(res){
            let prevMoneyStr = member.totalMoney.split(',').join(''); //출금전 금액 1,000,000 => 1000000
            let prevMoney = Number(prevMoneyStr);   //숫자 변환
            let sum = prevMoney - Number(refund.refundMoney); 
            let sumStr = addCommas(sum);   //문자열 변환

            setMember({...member, totalMoney: sumStr});
            onClose(null);
        })
        
    }
    

    return (
        <div className="refund-wrap">
            <div>
                <span>출금가능금액</span>
                <span>{member.totalMoney} 원</span>
            </div>
            <div>
                <div>금액 입력</div>
                <div>
                    <input type='text' maxLength={10} value={commaMoney} onChange={chgMoney} onBlur={chkMoney} /> 원
                </div>
                <p>{moneyMsg}</p>
            </div>
            <div>
                <span>입금계좌</span>
                <span>{member.memberBankCode} | {member.memberBankAccount}</span>
            </div>
            <div>
                <button onClick={refundMoney}>출금 신청하기</button>
            </div>
                
        </div>
    )
}