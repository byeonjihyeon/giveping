import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Box, colors, FormControl, MenuItem, Select } from "@mui/material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import FormHelperText from '@mui/material/FormHelperText';
import { blue } from "@mui/material/colors";



//환불 신청 목록
export default function RefundManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //환불 신청 또는 내역 버튼 눌렀을 때 쓰이는 변수
    const [showType, setShowType] = useState("request");  // "request" or "done"
    //환불 신청 목록 저장 변수
    const [refundList, setRefundList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});
    //미완료 => 완료 변경 시, 다시 10개의 목록 그릴 수 있도록 변경하기 위한 변수
    const [updStatus, setUpdStatus] = useState(false);

    useEffect(function(){

        let options = {};
        options.url = serverUrl + '/admin/refundManage/' + reqPage +'/'+ showType;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == boardMap
            setRefundList(res.data.resData.refundList);
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage, showType, updStatus]);

  // 환불 상태에 따라 목록 필터링
  /*
    const filterList = refundList.filter(function(refund){

        showType === "request" ? refund.refundStatus === 0 : refund.refundStatus === 1
    });
    */
  /*
  const filterList = refundList.filter(function(refund) {
  if (showType === "request") {
    return refund.refundStatus === 0;
  } else {
    return refund.refundStatus === 1;
  }
});
*/
    return (
        <>
            <div className="page-title">환불 신청 관리</div>
        <div className="two-nav">
            <ul>
                 <li>
                    <button onClick={() =>{ setShowType("request"); setReqPage(1);}}>환불신청</button>
                 </li>
                 <li>
                     <button onClick={() =>{ setShowType("done"); setReqPage(1);}}>환불내역</button>
                 </li>
         
            </ul>
        </div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"5%"}}>번호</th>
                        <th style={{width:"12%"}}>회원명</th>
                        <th style={{width:"12%"}}>환불금액</th>
                        <th style={{width:"12%"}}>은행</th>
                        <th style={{width:"20%"}}>계좌</th>
                        <th style={{width:"15%"}}>환불요청일</th>
                        {showType === "done" && <th style={{ width: "15%" }}>환불완료일</th>}
                        <th style={{width:"15%"}}>환불여부</th>
                    </tr>
                </thead>
                <tbody>
                    
                   {refundList.map(function(refund, index){
                        return <Refund key={"refund"+index} showType={showType} refund={refund} refundList={refundList} setRefundList={setRefundList} updStatus={updStatus} setUpdStatus={setUpdStatus}/>
                    
                   })}
                  
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} showType={showType} />
            </div>
        </>
    );

}

function Refund(props) {
    const refund = props.refund;
    
    const refundList = props.refundList;
    const setRefundList = props.setRefundList;
    const showType =props.showType;
    const reqPage =props.reqPage;

    const updStatus=  props.updStatus;
    const setUpdStatus = props.setUpdStatus;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


    //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(e){
        
      refund.refundStatus = e.target.value;

        let options = {};
        options.url = serverUrl + '/admin/refundManage';
        options.method = 'patch';
        options.data = {refundNo : refund.refundNo, refundStatus : refund.refundStatus};

        axiosInstance(options)

        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            if(res.data.resData){
                setRefundList([...refundList]);
                setUpdStatus(!updStatus);
            }
        });
    

    }
    return (
        <tr>
            <td>{refund.refundNo}</td>
            <td>{refund.memberName}</td>
            <td>{refund.refundMoney}원</td>
            <td>{refund.memberAccountBank}</td>
            <td>{refund.memberAccount}</td>
            <td>{refund.refundDate ? refund.refundDate.substring(0,10) : ''}</td>
            {showType === "done" ? <td>{refund.refundFinDate ? refund.refundFinDate.substring(0,10) : ''}</td> : ''}
            <td>
                {showType === "request" ? (
                 <FormControl sx={{ m:1, minWidth: 80}}fullWidth> 
                            <Select
                                    value={refund.refundStatus}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                <MenuItem value={0}>미완료</MenuItem>
                                <MenuItem value={1}>완료</MenuItem>
                        </Select>
                    </FormControl>
       
                ):("완료")}
            </td>
        </tr>
    );

}





