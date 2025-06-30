import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';

//환불 사업 목록
export default function RefundManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //기부사업 목록 저장 변수
    const [List, setBizList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});

    useEffect(function(){

        let options = {};
        options.url = serverUrl + '/admin/RefundManage/' + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == boardMap
            setBizList(res.data.resData.bizList);
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage]);

    return (
        <>
            <div className="page-title">기부 사업 관리</div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"15%"}}>글번호</th>
                        <th style={{width:"15%"}}>단체명</th>
                        <th style={{width:"15%"}}>신청일</th>
                        <th style={{width:"15%"}}>사업명</th>
                        <th style={{width:"15%"}}>신청정보열람</th>
                        <th style={{width:"15%"}}>상태변경</th>
                        <th style={{width:"15%"}}>수정사항</th>
                    </tr>
                </thead>
                <tbody>
                   {bizList.map(function(biz, index){
                        return <BoardItem key={"biz"+index} biz={biz} bizList={bizList} setBizList={setBizList} />
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
function BoardItem(props) {
    const biz = props.biz;
    const bizList = props.bizList;
    const setBizList = props.setBizList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

// 사업정보 정보 상세보기 버튼
function bizDetail(props) {
    const biz = props.biz;
        let options = {};
        options.url = serverUrl + '/biz/' + biz.orgNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                 navigate('(/biz/view' + biz.bizNo);
            }
        });
    }
    //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(){
      //  biz.boardStatus = board.boardStatus == 1 ? 2 : 1; //현재값이 1이면 2로 변경하고, 아니면 1로 변경

        let options = {};
        options.url = serverUrl + '/admin/bizManage';
        options.method = 'patch';
        options.data = {bizNo : biz.bizNo, bizStatus : biz.bizStatus};

        axiosInstance(options)
        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            if(res.data.resData){
                setBizList([...bizList]);
            }
        });
    }

    return (
        <tr>
            <td>{biz.bizNo}</td>
            <td>{biz.orgName}</td>
            <td>{biz.bizRegDate}</td>
            <td>{biz.bizName}</td>
            <td>
                <button onClick={BizDetail}>열람</button>
            </td>
     
            <td>
                 <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">상태</InputLabel>
                            <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={biz.bizStatus}
                                    label="Grade"
                                    onChange={handleChange}
                                    >
                                <MenuItem value={0}>미확인</MenuItem>
                                <MenuItem value={1}>승인</MenuItem>
                                <MenuItem value={2}>반려</MenuItem>
                                <MenuItem value={3}>삭제 요청</MenuItem>
                                <MenuItem value={4}>삭제</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </td>
                   <td>{biz.bizEdit}</td>
        </tr>
    );
}