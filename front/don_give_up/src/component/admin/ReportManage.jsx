import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Checkbox } from "@mui/material";

//신고 내역 목록
export default function ReportManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //기부사업 목록 저장 변수
    const [reportList, setReportList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});

    useEffect(function(){

        let options = {};
        options.url = serverUrl + '/admin/reportManage/' + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == boardMap
            setReportList(res.data.resData.reportList);
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage]);

    return (
        <>
            <div className="page-title">신고 내역 관리</div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"15%"}}>신고번호</th>
                        <th style={{width:"15%"}}>신고자</th>
                        <th style={{width:"15%"}}>단체명</th>
                        <th style={{width:"15%"}}>댓글내용</th>
                        <th style={{width:"15%"}}>신고코드</th>
                        <th style={{width:"15%"}}>신고상세사유</th>
                        <th style={{width:"15%"}}>신고날짜</th>
                        <th style={{width:"15%"}}>선택</th>
                    </tr>
                </thead>
                <tbody>
                   {reportList.map(function(report, index){
                        return <Report key={"report"+index} report={report} reportList={reportList} setReportList={setReportList} />
                   })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </>
    );
}

//게시글 1개
function Report(props) {
    const report = props.report;
    const reportList = props.reportList;
    const setReportList = props.setReportList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


    //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(){
      //  biz.boardStatus = board.boardStatus == 1 ? 2 : 1; //현재값이 1이면 2로 변경하고, 아니면 1로 변경

        let options = {};
        options.url = serverUrl + '/admin/reportManage';
        options.method = 'patch';
        options.data = {reportNo : report.reportNo, reportStatus : report.reportStatus};

        axiosInstance(options)
        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            if(res.data.resData){
                setReportList([...reportList]);
            }
        });
    }

    return (
        <tr>
            <td>{report.reportNo}</td>
            <td>{report.memberName}</td>
            <td>{report.orgName}</td>
            <td>{report.commentContent}</td>
            <td>{report.reportReason}</td>
            <td>{report.reportDetailReason}</td>
             <td>{report.reportDate.substring(0,10)}</td>
            <td>
                <Checkbox>□</Checkbox>
            </td>

        </tr>
    );
}