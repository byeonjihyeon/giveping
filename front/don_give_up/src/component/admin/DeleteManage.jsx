import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import * as React from 'react';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./admin.css";
import Loading from "../common/Loading";
import { Link } from "react-router-dom";


//상세보기 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign:'center'
  
};

//탈퇴 내역 목록
export default function DeleteManage(){
    const [isLoading, setIsLoading] = useState(false);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    //탈퇴 목록 저장 변수
    const [org, setOrg] = useState([]);
    const [deleteList, setDeleteList] = useState([]);
    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});
    const [showType, setShowType] = useState("request");
     //미완료 => 완료 변경 시, 다시 10개의 목록 그릴 수 있도록 변경하기 위한 변수
    const [updStatus, setUpdStatus] = useState(false);
    

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/admin/deleteManage/' + reqPage +'/'+ showType;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setIsLoading(false);
            setDeleteList(res.data.resData.deleteList); 
            setPageInfo(res.data.resData.pageInfo);
        });

        //reqPage 변경 시, useEffect 내부 함수 재실행
    }, [reqPage, showType, updStatus]);

    return (
        <>
            {isLoading ? <Loading/> : ""}
            <div className="page-title">탈퇴 신청 관리</div>
            <div className="search-and-nav">
                <div className="two-nav">
                    <ul>
                        <li>
                            <button onClick={() =>{ setShowType("request"); setReqPage(1);}} style={{width : "100px"}}>탈퇴신청</button>
                        </li>
                        <li>
                            <button onClick={() =>{ setShowType("done"); setReqPage(1);}}>탈퇴</button>
                        </li>
                
                    </ul>
                </div>
            </div>
            <table className="admin-tbl">
                <thead>
                    <tr>
                        <th style={{width:"15%"}}>단체명</th>
                        <th style={{width:"15%"}}>단체정보</th>
                        <th style={{width:"15%"}}>기부사업정보</th>
                        <th style={{width:"15%"}}>상태</th>    
                    </tr>
                </thead>
                <tbody>
                   {deleteList.map(function(org, index){
                        return <DelOrg key={"org"+index} org={org} setOrg={setOrg} showType={showType} setShowType={setShowType} deleteList={deleteList} setDeleteList={setDeleteList} updStatus={updStatus} setUpdStatus={setUpdStatus} setIsLoading={setIsLoading}/>
                   })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} showType={showType} setShowType={setShowType}updStatus={updStatus} setUpdStatus={setUpdStatus} />
            </div>
        </>
    );
}


function DelOrg(props) {
    const org = props.org;
    const setOrg =props.setOrg;
    const deleteList = props.deleteList;
    const setDeleteList = props.setDeleteList;
    const setIsLoading = props.setIsLoading;
  
    //탈퇴신청 =>탈퇴완료 변경 시, 다시 10개의 목록 그릴 수 있도록 변경하기 위한 변수
    const updStatus=  props.updStatus;
    const setUpdStatus = props.setUpdStatus;


    // 탈퇴 요청과 탈퇴 완료를 나눠서 보기 위함.
    const showType =props.showType;
    //단체가 진행한 기부사업을 리스트로 받음 
    const [biz,setBiz]=  useState([]);
    const [bizList, setBizList] = useState([]);

    //모달창 변수 
    const [open, setOpen] = useState(false);
    const [bizOpen, setBizOpen] = useState(false);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

  // 단체정보 보기 버튼 눌렀을 때 뜨는 모달창
   function orgDetail(){
       setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

  //기부사업정보 보기 버튼 눌렀을 때 모달창
    function orgBiz(props){
        const biz= props.biz;
       setBizOpen(true);
    }

    function bizClose() {
      setBizOpen(false);
    }


  //상태 값을 변경했을 때, 호출 함수  (onChange)
    function handleChange(e){
       setIsLoading(true);
        org.orgStatus = e.target.value;

        let options = {};
        options.url = serverUrl + '/admin/deleteManage';
        options.method = 'patch';
        options.data = {orgNo : org.orgNo, orgStatus : org.orgStatus};

        axiosInstance(options)
        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            setIsLoading(false);
            if(res.data.resData){
                setDeleteList([...deleteList]);
                setUpdStatus(!updStatus);
            }
        });
    }

    return (
        <>
        <tr>
            <td>{org.orgName}</td>
            <td><button className="show" onClick={orgDetail}>보기</button></td>
             <td><button className="show" onClick={orgBiz}>보기</button></td>
            
       <td style={{textAlign:"center",verticalAlign: "middle"}}>
          {showType === "request" ? (
                <Box sx={{ minWidth: 120 ,
                           display:"flex",
                           justifyContent:"center",
                           alignItems:"center",
                           height:"100%" }}>
                        <FormControl sx={{ minWidth: 120, width: "auto" }}>
                            <InputLabel id="demo-simple-select-label">상태</InputLabel>
                                <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={org.orgStatus}
                                        label="OrgStatus"
                                        onChange={handleChange}
                                        >
                                    <MenuItem value={3}>탈퇴 신청</MenuItem>
                                    <MenuItem value={4}>탈퇴</MenuItem>
                            </Select>
                        </FormControl>
                 </Box>        
                  ):("탈퇴상태")} 
             </td>

        </tr>
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                    <h2 className="style-h2">
                      <Link to={"/organization/view/" + org.orgNo}>{org.orgName} 상세 정보</Link>
                    </h2>
                    <div className="detail-div">
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
                                        <td><div style={{width  :"450px"}}>
                                            <textarea type="text" defaultValue={org.orgIntroduce } readOnly style={{width : "100%", height : "60px",
                                                                                                        border : "none", resize : "none",
                                                                                                        fontFamily: "Pretendard, sans-serif",
                                                                                                        fontSize : "16px", fontWeight : "light",
                                                                                                        color : "#333333"}}/>
                                        </div></td>
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
                             </div>
                             <div>
                                <button onClick={handleClose}>닫기</button>    
                            </div>
                     </Box>
             </Modal>
         <Modal open={bizOpen} onClose={bizClose}>
            <Box sx={modalStyle}>
                    <h2 className="style-h2">{org.orgName} 단체의 기부 사업</h2>
                    <div className="detail-div">
                      <table className='detail' border={1}> 
                                  <tbody>
                                          <tr>
                                              <th>기부사업명</th> 
                                              <th>사업 종료 날짜</th> 
                                              <th>사업모금액 입금 여부</th>
                                          </tr>

                                          {org.bizList && org.bizList.length > 0 ? (
                                            org.bizList.map((biz, index)=> (
                                              <tr key={'biz' + index}>
                                              <td>{biz.bizName}</td>
                                              <td>{biz.bizEnd?.substring(0, 10)}</td>
                                              <td>{biz.payoutStatus===0 ? 'N':'Y'}</td>
                                              </tr>
                                                ))
                                                ) : (
                                          <tr>
                                              <td colSpan={3}>등록된 기부 사업이 없습니다.</td>
                                          </tr>
                                          )}
                                  </tbody>
                      </table>
                    </div>
                    <div>
                        <button onClick={bizClose}>닫기</button>    
                    </div>
              </Box>
        </Modal>
             </>
    );
  }