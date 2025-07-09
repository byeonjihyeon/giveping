import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect } from "react";
import useUserStore from "../../store/useUserStore";
import { useState } from "react";
import Swal from "sweetalert2";

//단체 탈퇴하기(신청)
export default function OrgDelete(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const {loginOrg} = useUserStore();
    const orgNo = loginOrg.orgNo;

    //진행 중인 기부 사업 리스트
    const [bizList, setBizList] = useState([{bizName : "", bizDonateEnd : "", bizEnd : "", payoutYN : ""}]);

    //입력하는 비밀번호
    const [org, setOrg] = useState({orgNo : orgNo, orgPw : ""});

    //비밀번호 확인 여부
    const [type, setType] = useState(0);

    //단체의 진행 중 또는 입금 처리 안된 기부 사업 리스트 가져오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/bizList/" + orgNo;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setBizList(res.data.resData);
        });
    }, []);

    //비밀번호 onChange 함수
    function chgPw(e){
        setOrg({...org, orgPw : e.target.value});
    }

    //비밀번호 확인
    function chkPw(){
        let options = {};
        options.url = serverUrl + "/org/chkPw";
        options.method = "post";
        options.data = org;

        axiosInstance(options)
        .then(function(res){
            setType(1);
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            });
        });
    }

    //탈퇴 신청 버튼 클릭 시 호출 함수
    function deleteOrg(){
        Swal.fire({
            title : "알림",
            text : "탈퇴 신청하시겠습니까?",
            icon : "warning",
            showCancelButton : true,
            cancelButtonText : "취소",
            confirmButtonText : "확인"
        })
        .then(function(result){
            if(result.isConfirmed){
                let options = {};
                options.url = serverUrl + "/org/delete/" + orgNo;
                options.method = "patch";
        
                axiosInstance(options)
                .then(function(res){
                    Swal.fire({
                        title : "알림",
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText : "확인"
                    })
                    .then(function(result){
                        navigate("/org");
                    });
                });
            }
        });
    }

    return (
        <section className="section delete-wrap">
            <div className="page-title">탈퇴하기</div>
            {bizList == ""
            ? ""
            :<>
            <table border={1}>
                <thead>
                    <tr>
                        <th colSpan={4}>진행 중/입금 처리가 안된 기부 사업 리스트</th>
                    </tr>
                    <tr>
                        <th>사업명</th>
                        <th>모금 종료일</th>
                        <th>사업 종료일</th>
                        <th>입금 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {bizList.map(function(biz, index){
                        return  <tr key={"biz"+index}>
                                    <td>{biz.bizName}</td>
                                    <td>{biz.bizDonateEnd}</td>
                                    <td>{biz.bizEnd}</td>
                                    <td>{biz.payoutYN != null ? "O" : "X"}</td>
                                </tr>
                    })}
                </tbody>
            </table>
            <span>탈퇴 신청을 하더라도 위 기부 사업 리스트에서 사업 종료일이 지나고 입금 처리가 완료되어야 탈퇴 승인이 됩니다.</span>
            </>
            }
            <br/>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault(); //기본 이벤트 제어
                chkPw(); /*비밀번호 확인*/}} style={type == 1 ? {display : "none"} : {}}>
                <label htmlFor="orgPw">비밀번호 </label>
                <input type="password" id="orgPw" value={org.orgPw} onChange={chgPw}/>
                <button type="submit">확인</button>
            </form>
            <button type="button" onClick={deleteOrg} style={type == 0 ? {display : "none"} : {}}>탈퇴 신청</button>
        </section>
    )
}