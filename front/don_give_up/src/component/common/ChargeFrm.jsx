
import { useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//충전 컴포넌트
export default function ChargeFrm(props){
    const onClose = props.onClose; // ==setModalType
    const member = props.member;
    const setMember = props.setMember;

    //결제하기 버튼시, 회원번호 추출용도
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    //입력 금액 (서버 전송용)
    const [charge, setCharge] = useState("");
    
    //금액 유효성 메시지 변수
    const [chargeMsg, setChargeMsg] = useState("");

    //금액 유효성 체크 0: 입력전 1: 유효성x 2: 통과
    const [chkCharge, setChkCharge] = useState(0);

    //최대 충전금액 (100만원)
    const max = "1000000";
    
    //입력폼에 콤마로 단위찍어서 보여줄 변수
    const [commaCharge, setCommaCharge] = useState("0");


    //직접입력 선택시 금액입력칸으로 이동
    let inputEl = useRef(null);

    //숫자 3자리마다 콤마 찍는 함수
    function addCommas(money){
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    

    //금액input onChange (입력때마다 호출되어 제어)
    function chgCharge(e){
        const regExp = /^[0-9]*$/; // 0 ~ 9 숫자 입력만
        let inputCharge = e.target.value;

        if(inputCharge.indexOf(0) == '0'){ //0으로 시작 하면 유효성 x
            return;
        }

        if(regExp.test(inputCharge) || inputCharge == ""){ //입력값이 "" 이거나 유효성 통과
            
            if(inputCharge.length >= 7){    //입력값이 '1000000'원이 이상이면 최대금액으로 setCharge
                setCharge(max);
                setCommaCharge(addCommas(max)); 
                return;
            }
            setCharge(inputCharge);
            setCommaCharge(addCommas(inputCharge));
        }
    }

    //해당 돈단위 클릭시 돈단위만큼 증가하게 하게끔
    const addMoneyArr = ([
        {add : 1000, content: "+ 1,000원"},
        {add : 3000, content: "+ 3,000원"},
        {add : 5000, content: "+ 5,000원"},
        {add : 10000, content: "+ 10,000원"},
        {add : 50000, content: "+ 50,000원"}
    ])

    const [chargeMethod, setChargeMethod] = useState([
        {url: "", content : '신용·체크카드', select:false},
        {url: "", content : '빠른계좌이체', select:false},
        {url: "/images/KakaoPay.png", content : '카카오페이', select:false},
        {url: "/images/tosspay.png", content : '토스페이', select:false},
        {url: "/images/NPay.png", content : '네이버페이', select:false},
        {url: "", content : '무통장입금', select:false}
    ])

    //결제 선택 확인 변수
    const [selectMethod, setSelectMethod] = useState(false);

    //충전하기 버튼 클릭시 동작함수
    function recharge(){
        
        if(charge == "" || charge.slice(-3) != '000' || charge.length <= 3){    //빈값이거나, 천원단위가 아닌경우 유효성 X
            setChargeMsg("금액은 천원 단위로 입력하여주세요.");
            setChkCharge(1);
            return;
        }

        if(!selectMethod){
            setChargeMsg("결제방법 선택해주세요.");
            setChkCharge(1);
            return;
        }

        Swal.fire({
            title : '알림',
            text : '결제를 진행할까요?',
            icon : 'warning',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText : '취소'
        }).then(function(res){
            
            if(res.isConfirmed){
              
                let options = {};
                options.url = serverUrl + "/member/charge/" + loginMember.memberNo;
                options.method = 'post';
                options.params = {charge};
                
                axiosInstance(options)
                .then(function(res){
                    //console.log(member.totalMoney); 1,000,000 
                    let prevMoneyStr = member.totalMoney.split(',').join(''); //충전전 금액 1,000,000 => 1000000
                    let prevMoney = Number(prevMoneyStr);
                    let sum = prevMoney + Number(charge); 
                    let sumStr = addCommas(sum);   //1,200,000
                    
                    setMember({...member, totalMoney: sumStr});
                    onClose(null);         
                })

            }

        });

    }

    return (
        <div className="charge-wrap">
            <div>
                <div className="charge-input-wrap" >
                    <span>결제금액</span>
                    <div>
                        <input type='text' value={charge} onChange={chgCharge} ref={inputEl} placeholder="금액입력" /> 
                        <span> 원</span>
                    </div>
                </div>
               
            </div>
            <div className="money-range">
                {
                addMoneyArr.map(function(money, index){
                    function addCharge(){   //해당 클릭시 +금액만큼 증가하는 함수

                        let sum = Number(charge) + money.add;
                        
                        if(sum > 1000000){ //합이 백만원보다 크다면 종료.
                            setChargeMsg("최대 충전 금액입니다.");
                            setChkCharge(1);
                            return;
                        }
                        let sumStr = String(sum);
                        setCharge(sumStr);
                        setCommaCharge(addCommas(sumStr));
                    }
                    return <div key={"money" + index} onClick={addCharge}>{money.content}</div>
                })

                }
                <div onClick={function(){
                    inputEl.current.focus();
                }}>직접입력</div>
            </div>
            
            <div className="charge-method-wrap">
                <div className="title">결제방법</div>    
                <div className="charge-method">            
                {chargeMethod.map(function(method, index){
                                                                                                
                    return <div key={"method" + index} className={method.select ? "select" : ""} onClick={function(){   //결제방법 하나 클릭시, class 활성화 (나머지는 비활성화)
                                                                                                    let newChargeMethod = [...chargeMethod];        //결제 방법 깊은 복사
                                                                                                    for(let i=0; i<newChargeMethod.length; i++){
                                                                                                        if(i == index){
                                                                                                            newChargeMethod[index].select = !newChargeMethod[index].select;
                                                                                                            if(newChargeMethod[index].select){
                                                                                                                setSelectMethod(true);
                                                                                                            }else{
                                                                                                                setSelectMethod(false);
                                                                                                            }
                                                                                                        }else{
                                                                                                            newChargeMethod[i].select = false;
                                                                                                        }
                                                                                                    }

                                                                                                    setChargeMethod(newChargeMethod);
                                                                                            }}>
                            {
                                method.url == "" ? 
                                <span>{method.content}</span>
                                :
                                <img src={method.url} />
                            }
                            </div>
                })}
                </div>
            </div>
            <div className="charge-result">
                <span>총 </span> 
                <span>{commaCharge} 원</span>
            </div>
            <p className={chkCharge == 1 ? "charge-msg invalid" : "charge-msg"}> {chargeMsg}</p>
            <div className="charge">
                <button type="button" onClick={recharge}>충전하기</button>
            </div>
        </div>
    )
}