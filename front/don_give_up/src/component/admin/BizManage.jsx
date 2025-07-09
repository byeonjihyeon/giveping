import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Modal from '@mui/material/Modal';

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


//기부 사업 목록
export default function BizManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //기부사업 목록 저장 변수
    const [bizList, setBizList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});

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
                        <th style={{width:"15%"}}>상태</th>
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
    const [open, setOpen] = useState(false);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();



// 사업정보 상세보기 버튼 눌렀을 때 뜨는 모달창
  function bizDetail() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }


 /*   
// 사업정보 정보 상세보기 버튼
function bizDetail(props) {
    const biz = props.biz;
        let options = {};
        options.url = serverUrl + '/biz/' + biz.bizNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                 navigate('(/biz/view' + biz.bizNo);
            }
        });
    }
 */
    //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(e){
      const biz = props.biz;
      biz.bizStatus = e.target.value;

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
        <>
        <tr>
            <td>{biz.bizNo}</td>
            <td>{biz.orgName}</td>
            <td>{biz.bizRegDate.substring(0,10)}</td>
            <td>{biz.bizName}</td>
            <td>
                <button onClick={bizDetail}>열람</button>
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
       
       <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                    <h2>{biz.bizName} 상세 정보</h2>    
            <table className='detail' border={1}> 
                         <tbody>
                                <tr>
                                    <th>단체명</th>
                                    <td> {biz.orgName}</td>
                                </tr>
                                 <tr>
                                    <th>기부 카테고리</th> 
                                    <td> {biz.bizCtg}</td>
                                </tr>
                                 <tr>
                                   <th>사업 내용</th> 
                                    <td> {biz.bizContent}</td>
                                 </tr>
                                  <tr>
                                    <th>모금 기간</th>  
                                    <td>{biz.bizDonateStart.substring(0,10)}~{biz.bizDonateEnd.substring(0,10)}</td>
                                 </tr>
                                  <tr>
                                    <th>사업 기간</th>
                                     <td>{biz.bizStart.substring(0,10)}~{biz.bizEnd.substring(0,10)}</td>
                                 </tr>
                                  <tr>
                                    <th>목표 후원 금액</th> 
                                    <td>{biz.bizGoal}</td>
                                </tr>         
                           </tbody>
                         </table>
                             <button onClick={handleClose}>닫기</button>    
                     </Box>
             </Modal>
             </>
    );
}