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

    //계좌 인증확인여부 변수
    const [isValid, setIsValid] = useState(false);

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
            setAccountMsg("은행을 선택하여주세요.");
            return;
        }

        if(member.memberBankAccount.length == 0 && member.memberBankAccount == " "){
            setAccountMsg("계좌를 입력하여주세요.('-'제외)");
            return;
        }else{
            let regExp = /^[0-9]+$/; // 0~9만 입력
            if(!regExp.test(member.memberBankAccount)){
                setAccountMsg("계좌를 다시한번 확인하여주세요.('-'제외)");
                return;
            }
        }
     
        //api 인증하기 (가정)
        //결과 true or false

        if(true){
            console.log(mainMember.memberBankCode);
            setAccountMsg("계좌인증완료");
            setIsValid(true);
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

         <div>
            <div>{mainMember.memberName}</div>
            <div>{mainMember.memberBirth}</div>
            {
            (mainMember.memberBankCode != "0") && (mainMember.memberBankCode != "") ? 
               <div>{mainMember.memberBankCode} | {mainMember.memberBankAccount} <button onClick={updAccount}>초기화</button></div>
            :   
                <div>
                    <div>
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
                        <p>{accountMsg}</p>
                    </div>
                    <div>
                       <button onClick={regAccount}>등록하기</button> 
                    </div>
                </div>
            }
        </div>           
    )
       
   
    
}