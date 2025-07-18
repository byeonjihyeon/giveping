import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Checkbox, Tooltip } from "@mui/material";
import { Tabs, Tab, Box, TextField, Button } from "@mui/material";
import "./admin.css";

export default function ReportManage() {
  const [tab, setTab] = useState("comment"); // comment or org
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState();
  const [reportList, setReportList] = useState([]);
  const axiosInstance = createInstance();
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
 
     //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});
    const [reqPage, setReqPage] = useState(1);

useEffect(() => {

    //fetchReportList();
     axiosInstance({
      method: "get",
      url: serverUrl +"/admin/reportManage/" + reqPage +"/"+ tab,
      params: {
        startDate : startDate || "",
        endDate : endDate || "",
      },
    })
      .then((res) => {
     
        if (res.data.resData) {
          setReportList(res.data.resData.reportList);
          setPageInfo(res.data.resData.pageInfo);
        } else {
          setReportList([]);
          setPageInfo({});
        }
      })
      .catch((err) => {
        console.error(err);
        setReportList([]);
        setPageInfo({});
      });
  
}, [reqPage, tab]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setReportList([]); // 탭 변경 시 리스트 초기화
    setStartDate("");
    setEndDate("");
    setReqPage(1);
  };

  const fetchReportList = () => {
    if((startDate && endDate)) {
        axiosInstance({
      method: "get",
      url: serverUrl +"/admin/reportManage/" + reqPage +"/"+ tab,
      params: {
        startDate : startDate || "",
        endDate : endDate || "",
      },
    })
      .then((res) => {

        if (res.data.resData) {
          setReportList(res.data.resData.reportList);
          setPageInfo(res.data.resData.pageInfo);
        } else {
          setReportList([]);
          setPageInfo({});
        }
      })
      .catch((err) => {
        console.error(err);
        setReportList([]);
        setPageInfo({});
      });

    }else{
        alert("시작일과 종료일을 모두 입력해주세요.");
      return;

    }
  };

  return (
    <>
       <div className="page-title">신고 내역 관리</div>
       <div className="search-and-nav">
          <div className="two-nav">
              <Box sx={{ width: "100%", typography: "body1", p: 2 , paddingTop : "0"}}>
                <Tabs value={tab} onChange={handleChangeTab} style={{float : "right"}}>
                  <Tab label="댓글 신고" value="comment" style={{width : "100px"}}/>
                  <Tab label="단체 신고" value="org" style={{width : "100px"}}/>
                </Tabs>
              </Box>
          </div>
          <div className="search">
              <Box sx={{ mt: 3, mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="시작일"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) =>{
                    setStartDate(e.target.value)}}
                />
                <TextField
                  label="종료일"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="contained" onClick={fetchReportList}>
                  검색
                </Button>
              </Box>
            </div>
        </div>
           <div>
        {reportList.length === 0 ? (
          <div>조회된 신고 내역이 없습니다.</div>
        ) : (
          <div>
          <table className="admin-tbl" >
            <thead>
              <tr>
                <th>신고번호</th>
                <th>신고자</th>
                <th>{tab === "comment" ? "댓글 내용" : "단체명"}</th>
                <th>신고코드</th>
                <th>신고상세사유</th>
                <th>신고일</th>
              </tr>
            </thead>
            <tbody>
                  {reportList.map((report) => (
                <tr key={report.reportNo}>
                  <td>{report.reportNo}</td>
                  <td>{report.memberName}</td>
                 <td>
                    {tab === "comment" ? (
                      report.commentDeleted === 0 ? (
                        <Tooltip title={report.commentContent} arrow>
                          <a
                            className="report-nev"
                            href={`/news/view/${report.newsNo}#comment-${report.commentNo}`}
                            style={{ textDecoration: "none", color: "#1976d2" }}
                          >
                            {report.commentContent.length > 10
                              ? report.commentContent.slice(0, 10) + "..."
                              : report.commentContent}
                          </a>
                        </Tooltip>
                      ) : (
                        <span style={{ color: "gray", opacity: 0.6 }}>
                          {report.commentContent.length > 10
                            ? report.commentContent.slice(0, 10) + "..."
                            : report.commentContent}
                        </span>
                      )
                    ) : (
                      report.orgStatus === 1 || report.orgStatus === 3 ? (
                        <a
                          className="report-nev"
                          href={`/organization/view/${report.orgNo}`}
                          style={{ textDecoration: "none", color: "#1976d2" }}
                        >
                          {report.orgName}
                        </a>
                      ) : (
                        <span style={{ color: "gray", opacity: 0.6 }}>
                          {report.orgName}
                        </span>
                      )
                    )}
                  </td>
                  <td>{report.reportReason}</td>
                  <td>{report.reportDetailReason}</td>
                  <td>{report.reportDate.substring(0, 10)}</td>
                </tr>
                  ))}
            </tbody>
          </table>
          </div>
        )}
     
    </div>
     <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
     </div>
     </>
  );
}
/*
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

    */