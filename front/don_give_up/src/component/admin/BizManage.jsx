import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import "./admin.css";
import Loading from "../common/Loading";


//상세보기 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};


//기부 사업 목록
export default function BizManage(){
    const [isLoading, setIsLoading] = useState(true);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //기부사업 목록 저장 변수
    const [bizList, setBizList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});

    const [status, setStatus] = useState("");           // 상태 선택값
    const [keyword, setKeyword] = useState("");         // 키워드 입력값
    const [searchType, setSearchType] = useState("bizName"); // 검색 타입 (ex: 사업명)


    //검색을 위한 함수
     function handleSearch(page) {
        let options ={
            url : serverUrl + "/admin/bizManage/" + page,
            method : 'get',
            params: {status, searchType, keyword},
        };

        axiosInstance(options)
        .then((res) => {
            setIsLoading(false);
            setBizList(res.data.resData.bizList);
            setPageInfo(res.data.resData.pageInfo);
        });
        
        }

    useEffect(function(){
     handleSearch(reqPage);
        }, [reqPage, status, searchType, keyword]); 

/*
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/admin/bizManage/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == boardMap
            setBizList(res.data.resData.bizList);
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage]);

    
*/


    return (
        <>
            {isLoading ? <Loading/> : ""}
            <div className="page-title">기부 사업 관리</div>
            <div className="search">
             <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>상태</InputLabel>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)} label="상태">
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="0">미확인</MenuItem>
                    <MenuItem value="1">승인</MenuItem>
                    <MenuItem value="2">반려</MenuItem>
                    <MenuItem value="3">삭제요청</MenuItem>
                    <MenuItem value="4">삭제</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>검색구분</InputLabel>
                    <Select value={searchType} onChange={(e) => setSearchType(e.target.value)} label="검색구분">
                    <MenuItem value="bizName">사업명</MenuItem>
                    <MenuItem value="orgName">단체명</MenuItem>
                    </Select>
                </FormControl>

                <TextField label="검색어" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <Button variant="contained" onClick={handleSearch}>검색</Button>
                </Box>
           </div>
            <table className="admin-tbl">
                <thead>
                    <tr>
                        <th style={{width:"15%"}}>글번호</th>
                        <th style={{width:"15%"}}>단체명</th>
                        <th style={{width:"15%"}}>신청일</th>
                        <th style={{width:"15%"}}>사업명</th>
                        <th style={{width:"15%"}}>신청정보열람</th>
                        <th style={{width:"15%"}}>상태</th>
                        <th style={{width:"15%"}}>수정사항</th>
                    </tr>
                </thead>
                <tbody>
                   {bizList.map(function(biz, index){
                        return <BoardItem key={"biz"+index} biz={biz} bizList={bizList} setBizList={setBizList} setIsLoading={setIsLoading}/>
                   })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
           

        </>
    );
}


function BoardItem(props) {
    const biz = props.biz;
    const bizList = props.bizList;
    const setBizList = props.setBizList;
    const setIsLoading = props.setIsLoading;

    const [open, setOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [prevStatus, setPrevStatus] = useState(null); // 이전 상태 저장

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    function bizDetail() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    //  상태 변경 시
    function handleChange(e) {
        const newStatus = e.target.value;

        setPrevStatus(biz.bizStatus);      // 현재 상태 저장
        biz.bizStatus = newStatus;         // 상태 변경

        if (newStatus === 2) {
            setRejectOpen(true);           // 반려 선택 시, 사유 입력 모달
            return;
        }

        updateBizStatus(newStatus);        // 나머지는 바로 반영
    }

    //  상태 업데이트
    function updateBizStatus(newStatus, bizEdit = "") {
        setIsLoading(true);
        biz.bizStatus = newStatus;

        let options = {
            url: serverUrl + '/admin/bizManage',
            method: 'patch',
            data: {
                bizNo: biz.bizNo,
                bizStatus: newStatus,
                bizEdit: bizEdit
            }
        };

        axiosInstance(options).then(function (res) {
            setIsLoading(false);
            if (res.data.resData) {
                alert("처리되었습니다.");
                setRejectOpen(false);
                setBizList([...bizList]); // 화면 갱신
            }
        });
    }

    //  반려 사유 제출
    function handleRejectSubmit() {
        if (!rejectReason.trim()) {
            alert("반려 사유를 입력해주세요.");
            return;
        }

        updateBizStatus(2, rejectReason);
        setRejectReason("");
        setRejectOpen(false);
    }

    // 반려 취소
    function handleRejectCancel() {
        biz.bizStatus = prevStatus;        // 이전 상태로 되돌림
        setRejectReason("");               // 사유 초기화
        setRejectOpen(false);              // 모달 닫기
        setBizList([...bizList]);          // 화면 갱신
    }

    return (
        <>
            <tr>
                <td>{biz.bizNo}</td>
                <td>{biz.orgName}</td>
                <td>{biz.bizRegDate.substring(0, 10)}</td>
                <td>{biz.bizName}</td>
                <td><button onClick={bizDetail}>열람</button></td>
                <td>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel>상태</InputLabel>
                            <Select
                                value={biz.bizStatus}
                                label="상태"
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

            {/* 상세 모달 */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <h2>{biz.bizName} 상세 정보</h2>
                    <table className='detail' border={1}>
                        <tbody>
                            <tr><th>단체명</th><td>{biz.orgName}</td></tr>
                            <tr><th>기부 카테고리</th><td>{biz.bizCtg}</td></tr>
                            <tr><th>사업 내용</th><td>{biz.bizContent}</td></tr>
                            <tr><th>모금 기간</th><td>{biz.bizDonateStart.substring(0, 10)}~{biz.bizDonateEnd.substring(0, 10)}</td></tr>
                            <tr><th>사업 기간</th><td>{biz.bizStart.substring(0, 10)}~{biz.bizEnd.substring(0, 10)}</td></tr>
                            <tr><th>목표 후원 금액</th><td>{biz.bizGoal}</td></tr>
                        </tbody>
                    </table>
                    <button onClick={handleClose}>닫기</button>
                </Box>
            </Modal>

            {/* 반려 사유 입력 모달 */}
            <Modal open={rejectOpen} onClose={() => setRejectOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>반려 사유 입력</Typography>
                    <TextField
                        fullWidth
                        label="반려 사유"
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" color="inherit" onClick={handleRejectCancel}>
                            취소
                        </Button>
                        <Button variant="contained" color="error" onClick={handleRejectSubmit}>
                            반려 처리
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}