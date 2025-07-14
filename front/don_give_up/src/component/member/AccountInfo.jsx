import { useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//계좌 인증 및 등록 컴포넌트
export default function AccountInfo(props){
    const mainMember = props.member;
    const setMainMember = props.setMember;

    const {loginMember} = useUserStore();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버전송용 변수
    const [member, setMember] = useState({
        memberNo : loginMember.memberNo,
        memberBankCode: "0",
        memberBankAccount: ""
    })

    //계좌 유효성 메시지 변수
    const [accountMsg , setAccountMsg] = useState("");

    //계좌 인증확인여부 변수 0:입력, 1:유효성통과x, 2: 인증완료
    const [isValid, setIsValid] = useState(0);

    //은행선택 및 계좌입력 onChange
    function chgAccount(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    //인증하기 버튼 클릭시 호출함수
   function chkAccount(){
        setIsValid(false);
        
        //은행 유효성 검사 (select 태그)
        if(member.memberBankCode == "0"){
            setIsValid(1);
            setAccountMsg("은행을 선택하여주세요.");
            return;
        }

        if(member.memberBankAccount.length == 0 && member.memberBankAccount == " "){
            setAccountMsg("계좌를 입력하여주세요.('-'제외)");
            setIsValid(1);
            return;
        }else{
            let regExp = /^[0-9]+$/; // 0~9만 입력
            if(!regExp.test(member.memberBankAccount)){
                setIsValid(1);
                setAccountMsg("계좌를 다시한번 확인하여주세요.('-'제외)");
                return;
            }
        }
     
        //api 인증하기 (가정)
        //결과 true or false

        if(true){
            setAccountMsg("계좌인증완료");
            setIsValid(2);
        }else{
            alert('계좌인증실패');
        }
   }

   //초기화 버튼 클릭시 동작함수
   function updAccount(){
       
        let options  = {};
        options.url = serverUrl + "/member/account";
        options.data = member;
        options.method = 'patch';

        axiosInstance(options)
        .then(function(res){
            setMainMember({...mainMember, memberBankCode: member.memberBankCode, memberBankAccount: member.memberBankAccount});
        })
   }
   
   //등록하기 버튼 클릭시 동작함수
   function regAccount(){
        if(!isValid){
            return;
        }

        let options  = {};
        options.url = serverUrl + "/member/account";
        options.data = member;
        options.method = 'patch';

        axiosInstance(options)
        .then(function(res){
            setMainMember({...mainMember, memberBankCode: member.memberBankCode, memberBankAccount: member.memberBankAccount});
            setAccountMsg("");
            setIsValid(false);
            setMember({...member, memberBankCode: "0", memberBankAccount: ""})
        })
   }

    return(
        <div className="account-change-wrap">
            <div className="account-change-title">
                출금계좌 조회 / 변경
            </div>
            <div className="account-user-wrap">
                <div className="account-user">
                    <div className="account-user-title">이름</div>
                    <div>{mainMember.memberName}</div>
                </div>
                <div className="account-user">
                    <div className="account-user-title" >생년월일</div>
                    <div>{mainMember.memberBirth}</div>
                </div>

                {
                (mainMember.memberBankCode != "0") && (mainMember.memberBankCode != "") ? 
                <div className="account-user">
                    <div className="account-user-title">인증계좌</div>
                <div className="account-info">
                    ({mainMember.memberBankCode}) {mainMember.memberBankAccount} 
                    <button onClick={updAccount}>초기화</button></div>
                </div>
                :   
                    <div>
                        <div className="account-reg-wrap">       
                            <select defaultValue="" id='memberBankCode' onChange={chgAccount}>
                                <option value="" disabled>은행선택</option>
                                <option value="국민은행">국민은행</option>
                                <option value="신한은행">신한은행</option>
                                <option value="하나은행">하나은행</option>
                                <option value="우리은행">우리은행</option>
                                <option value="iM뱅크">iM뱅크</option>
                                <option value="기업은행">기업은행</option>
                                <option value="농협은행">농협은행</option>
                                <option value="우체국">우체국</option>
                                <option value="카카오뱅크">카카오뱅크</option>
                                <option value="토스뱅크">토스뱅크</option>
                            </select>
                            <input type='text' id='memberBankAccount' maxLength={30} placeholder="계좌 입력 '-'제외" value={member.memberBankAccount} onChange={chgAccount} />
                            <button onClick={chkAccount} >인증</button>
                        </div>
                        <p className={isValid == 1? "account-msg invalid" : isValid == 2 ? "account-msg valid" : "account-msg"}> {accountMsg}</p>
                        <div>
                            <button className="account-reg-btn" onClick={regAccount}>등록하기</button> 
                        </div>
                    </div>
                }
            </div>  
    </div>             
    )
       
   
    
}