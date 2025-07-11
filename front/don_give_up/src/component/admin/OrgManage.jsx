import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import { Navigate, useNavigate } from "react-router-dom";
import DeleteManage from "./DeleteManage";

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

export default function OrgManage(){

   const navigate= useNavigate();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //단체 목록 저장 변수
    const [orgList, setOrgList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    
    //환불 신청 또는 내역 버튼 눌렀을 때 쓰이는 변수
     const [showType, setShowType] = useState();  // "request" or "done"

     

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/admin/orgManage/" + reqPage ;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setOrgList(res.data.resData.orgList);
            setPageInfo(res.data.resData.pageInfo);
        });


    },[reqPage]);



   // 가입요청 버튼 눌렀을 때
  function join(){
    navigate  ('/admin/orgManage')
  }

    //탈퇴요청 버튼 눌렀을 때
  function delDone(){
    navigate('/admin/deleteManage')
  }
  
  
    return (
        <>
            <div className="page-title">단체 관리</div>
             <div className="org">
            <ul>
                 <li>
                    <button onClick={join}>가입신청</button>
                 </li>
                 <li>
                     <button onClick={delDone}>탈퇴신청</button>
                 </li>
            </ul>
            </div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"20%"}}>번호</th>
                        <th style={{width:"20%"}}>단체명</th>
                        <th style={{width:"20%"}}>신청일자</th>
                        <th style={{width:"20%"}}>상세정보</th>
                        <th style={{width:"20%"}}>상태</th>
                    </tr>
                </thead>
                <tbody>
                    { orgList.map(function(org, index){
                        return <Org key={"org"+index} org={org} orgList={orgList} setOrgList={setOrgList} />
                    })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </>
    );





}



function Org(props) {
    const org = props.org;
    const orgList = props.orgList;
    const setOrgList = props.setOrgList;
    const [open, setOpen] = useState(false);
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 단체 정보 상세보기 버튼
   //function OrgDetail(props) {
    /*
        let options = {};
        options.url = serverUrl + '/org/' + org.orgNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                 navigate('(/org/orgUpdate/' + org.orgNo);
            }

        });*/


  


   // 단체 상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(e){
        org.orgStatus = e.target.value;

        let options = {};
        options.url = serverUrl + '/admin/orgManage';
        options.method = 'patch';
        options.data = {orgNo : org.orgNo, orgStatus : org.orgStatus};

        axiosInstance(options)
        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            if(res.data.resData){
                setOrgList([...orgList]);
            }
        });
    }
// 단체정보 상세보기 버튼 눌렀을 때 뜨는 모달창
    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
        <tr>
            <td>{org.orgNo}</td>
            <td>{org.orgName}</td>
            <td>{org.orgEnrollDate.substring(0,10)}</td>
            <td>
                <button onClick={handleOpen}>보기</button>
            </td>
            <td> 
                <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">상태</InputLabel>
                                <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={org.orgStatus}
                                        label="OrgStatus"
                                        onChange={handleChange}
                                        >
                                    <MenuItem value={0}>미승인</MenuItem>
                                    <MenuItem value={1}>승인</MenuItem>
                                    <MenuItem value={2}>반려</MenuItem>
                                  </Select>

                        </FormControl>
                 </Box>          
       

           </td>
       </tr>

        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                    <h2>{org.orgName} 상세 정보</h2>    
            <table className='detail' border={1}> 
                         <tbody>
                                <tr>
                                    <th>단체 아이디</th>
                                    <td> {org.orgId}</td>
                                </tr>
                                 <tr>
                                   <th>단체 사업자 번호</th> 
                                    <td> {org.orgBiznum}</td>
                                 </tr>
                                  <tr>
                                    <th>단체 전화번호</th>  
                                    <td>{org.orgPhone}</td>
                                 </tr>
                                  <tr>
                                    <th>단체 이메일 </th>
                                     <td>{org.orgEmail}</td>
                                 </tr>
                                  <tr>
                                    <th>단체 주소 </th> 
                                    <td>{org.orgAddrMain}</td>
                                    </tr>
                                  <tr>
                                    <th>단체 상세주소</th> 
                                    <td> {org.orgAddrDetail}</td>
                                    </tr>
                                  <tr>
                                    <th>단체 소개</th> 
                                     <td>{org.orgIntroduce}</td>
                                     </tr>
                                  <tr>
                                    <th>단체 계좌은행</th> 
                                    <td>{org.orgAccountBank}</td>
                                    </tr>
                                  <tr>
                                    <th>단체 계좌번호</th>
                                    <td> {org.orgAccount}</td>
                                    </tr>
                                  <tr>
                                    <th>단체 가입일</th>
                                     <td> {org.orgEnrollDate.substring(0,10)}</td>
                                     </tr>
                                  <tr>
                                    <th>단체 온도</th> 
                                     <td>{org.orgTemperature}</td>
                                     </tr>
                                  <tr>
                                    <th>단체 홈페이지 주소</th> 
                                    <td>{org.orgUrl}</td>
                                  </tr>
                                  </tbody>
                             </table>
                                    <button onClick={handleClose}>닫기</button>    
                     </Box>
             </Modal>


       
             </>
    );
}
/*
    function OrgDetail(props) {
    const org = props.org;
    const close= props.close;
    const orgList = props.orgList;
    const setOrgList = props.setOrgList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


 return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{org.orgName} 상세정보</h2>
        <p>단체 번호: {org.orgNo}</p>
        <p>신청일자: {org.orgEnrollDate}</p>
        <button onClick={close}>닫기</button>
      </div>
    </div>
  );
  
}
*/
