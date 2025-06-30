import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//단체 목록
export default function OrgManage(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //단체 목록 저장 변수
    const [orgList, setOrgList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/admin/orgManage/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setOrgList(res.data.resData.orgList);
            setPageInfo(res.data.resData.pageInfo);
        });


    },[reqPage]);

    return (
        <>
            <div className="page-title">단체 관리</div>
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
    const orgList = props.memberList;
    const setOrgList = props.setOrgList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 단체 정보 상세보기 버튼
function OrgDetail(props) {
        let options = {};
        options.url = serverUrl + '/org/' + org.orgNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                 navigate('(/org/orgUpdate/' + org.orgNo);
            }
        });
    }
    /*
    const org = props.member;
    const memberList = props.memberList;
    const setMemberList = props.setMemberList;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    function handleChange(e){
        member.memberLevel = e.target.value;

        let options = {};
        options.url = serverUrl + "/admin/member";
        options.method = 'patch';
        options.data = {memberId : member.memberId, memberLevel : member.memberLevel};

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setMemberList([...memberList]);
            }
        });
        

    }
*/

    return (
        <tr>
            <td>{org.orgNo}</td>
            <td>{org.orgName}</td>
            <td>{org.orgEnrollDate}</td>
            <td>
                <button onClick={OrgDetail}>보기</button>
            </td>
            <td>{org.orgStatus}</td>
        </tr>
    );
}