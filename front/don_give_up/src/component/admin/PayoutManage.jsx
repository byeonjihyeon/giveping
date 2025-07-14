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



//관리자 모금액 송금 목록
export default function PayoutManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //모금액 미송금내역 또는 입금내역버튼 눌렀을 때 쓰이는 변수
    const [showType, setShowType] = useState("todo");  // "todo" or "done"
    //모금액 미송금 목록 저장 변수
    const [payoutList, setPayoutList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});
    //미완료 => 완료 변경 시, 다시 10개의 목록 그릴 수 있도록 변경하기 위한 변수
    const [updStatus, setUpdStatus] = useState(false);

    useEffect(function(){

        let options = {};
        options.url = serverUrl + '/admin/payoutManage/' + reqPage +'/'+ showType;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == boardMap
            setPayoutList(res.data.resData.payoutList);
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage, showType, updStatus]);

  // 입금 상태에 따라 목록 필터링
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
            <div className="page-title">관리자 모금액 송금 관리</div>
        <div className="two-nav">
            <ul>
                 <li>
                    <button onClick={() =>{ setShowType("todo"); setReqPage(1);}}>미송금내역</button>
                 </li>
                 <li>
                     <button onClick={() =>{ setShowType("done"); setReqPage(1);}}>송금내역</button>
                 </li>
         
            </ul>
        </div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"5%"}}>송금번호</th>
                        <th style={{width:"12%"}}>단체명</th>
                        <th style={{width:"12%"}}>기부사업</th>
                        <th style={{width:"12%"}}>모금종료날짜</th>
                        <th style={{width:"20%"}}>목표후원금</th>
                        <th style={{width:"15%"}}>모금액(송금액)</th>
                        <th style={{width:"15%"}}>송금여부</th>
                        {showType === "done" && <th style={{ width: "15%" }}>송금완료일</th>}
                        
                    </tr>
                </thead>
                <tbody>
                    
                   {payoutList.map(function(payout, index){
                        return <Payout key={"payout"+index} showType={showType} payout={payout} payoutList={payoutList} setPayoutList={setPayoutList} updStatus={updStatus} setUpdStatus={setUpdStatus}/>
                    
                   })}
                  
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} showType={showType} />
            </div>
        </>
    );

}

function Payout(props) {
    const payout = props.payout;
    
    const payoutList = props.payoutList;
    const setPayoutList = props.setPayoutList;
    const showType =props.showType;
    const reqPage =props.reqPage;

    const updStatus=  props.updStatus;
    const setUpdStatus = props.setUpdStatus;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


    //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(e){
        
      payout.payoutStatus = e.target.value;

        let options = {};
        options.url = serverUrl + '/admin/payoutManage';
        options.method = 'patch';
        options.data = {payoutNo : payout.payoutNo, payoutStatus : payout.payoutStatus};

        axiosInstance(options)

        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            if(res.data.resData){
                setPayoutList([...payoutList]);
                setUpdStatus(!updStatus);
            }
        });
    }
    return (
        <tr>
            <td>{payout.payoutNo}</td>
            <td>{payout.orgName}</td>
            <td>{payout.bizName}</td>
            <td>{payout.bizDonateEnd.substring(0,10)}</td>
            <td>{payout.bizGoal}</td>
            <td>{payout.payoutAmount}</td>
            <td>
                {showType === "todo" ? (
                 <FormControl sx={{ m:1, minWidth: 80}}fullWidth> 
                            <Select
                                    value={payout.payoutStatus}
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
            {showType === "done" ? <td>{payout.payoutDate ? payout.payoutDate.substring(0,10) : ''}</td> : ''}
        </tr>
    );

}
