import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//회원 목록
export default function MemberManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //회원 목록 저장 변수
    const [memberList, setMemberList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/admin/memberManage/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setMemberList(res.data.resData.memberList);
            setPageInfo(res.data.resData.pageInfo);
        });


    },[reqPage]);

    return (
        <>
            <div className="page-title">회원 관리</div>
            <table className="tbl">
                <thead>
                    <tr>
                        <th style={{width:"10%"}}>번호</th>
                        <th style={{width:"10%"}}>아이디</th>
                        <th style={{width:"10%"}}>이름</th>
                        <th style={{width:"10%"}}>전화번호</th>
                        <th style={{width:"10%"}}>이메일</th>
                        <th style={{width:"10%"}}>주소</th>
                        <th style={{width:"10%"}}>생년월일</th>
                        <th style={{width:"10%"}}>가입일</th>      
                    </tr>
                </thead>
                <tbody>
                    {memberList.map(function(member, index){
                        return <Member key={"member"+index} member={member} memberList={memberList} setMemberList={setMemberList} />
                    })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </>
    );
}

//회원 1명
function Member(props) {
    const member = props.member;
    const memberList = props.memberList;
    const setMemberList = props.setMemberList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();




    return (
        <tr>
            <td>{member.memberNo}</td>
            <td>{member.memberId}</td>
            <td>{member.memberName}</td>
            <td>{member.memberPhone}</td>
            <td>{member.memberEmail}</td>
            <td>{member.memberAddr}</td>
            <td>{member.memberBirth}</td>
            <td>{member.memberEnrollDate}</td>
        </tr>
    );
}