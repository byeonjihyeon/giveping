import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect } from "react";
import useUserStore from "../../store/useUserStore";
import { useState } from "react";
import Swal from "sweetalert2";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

//단체 탈퇴하기(신청)
export default function OrgDelete(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const {loginOrg} = useUserStore();
    const orgNo = loginOrg ? loginOrg.orgNo : "";

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

    //비밀번호 확인wrap
    function chkPw(){
        let options = {};
        options.url = serverUrl + "/org/chkPw";
        options.method = "post";
        options.data = org;

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setType(1);
                Swal.fire({
                    title : "알림",
                    text : "확인되었습니다.",
                    icon : "success",
                    confirmButtonText : "확인"
                });
            }else {
                Swal.fire({
                    title : "알림",
                    text : "비밀번호가 일치하지 않습니다.",
                    icon : "warning",
                    confirmButtonText : "확인"
                });
            }
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
        <section className="section org-delete-wrap">
            <h2 className="page-title" style={{textAlign : "left", marginLeft : "20px"}}>탈퇴하기</h2>
            {bizList == ""
            ? ""
            :<>
            <table className="tbl-donate" style={{marginTop : "20px"}}>
                <thead>
                    <tr>
                        <th colSpan={4}>진행 중/입금 처리가 안된 기부 사업 리스트</th>
                    </tr>
                    <tr>
                        <th>사업명</th>
                        <th style={{width : "15%"}}>모금 종료일</th>
                        <th style={{width : "15%"}}>사업 종료일</th>
                        <th style={{width : "10%"}}>입금 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {bizList.map(function(biz, index){
                        return  <tr key={"biz"+index}>
                                    <td>{biz.bizName}</td>
                                    <td>{biz.bizDonateEnd}</td>
                                    <td>{biz.bizEnd}</td>
                                    <td>{biz.payoutYN == 1 ? "O" : "X"}</td>
                                </tr>
                    })}
                </tbody>
            </table>
            <p>*위 기부 사업 리스트에서 사업 종료일이 지나고 입금 처리가 완료되어야 탈퇴 승인이 됩니다.</p>
            </>
            }
            <br/>
            <div style={{width : "500px", margin : "0 auto", textAlign : "center"}}>
                <form autoComplete="off" onSubmit={function(e){
                    e.preventDefault(); //기본 이벤트 제어
                    chkPw(); /*비밀번호 확인*/}} style={type == 1 ? {display : "none"} : {display : "flex"}}>
                    <label htmlFor="orgPw" className="label" style={{fontWeight : "bold"}}>비밀번호 </label>
                    <TextField type="password" id="orgPw" className="input-login" value={org.orgPw} onChange={chgPw}/>
                    <Button variant="contained" type="submit" style={{marginLeft : "5px"}} id="mui-btn">확인</Button>
                </form>
                <Button variant="contained" type="button" className="orgBtn" onClick={deleteOrg} id="mui-btn"
                style={type == 0 ? {display : "none", height : "40px", fontSize : "20px"} : {height : "40px", fontSize : "20px"}}>탈퇴 신청</Button>
            </div>
        </section>
    )
}