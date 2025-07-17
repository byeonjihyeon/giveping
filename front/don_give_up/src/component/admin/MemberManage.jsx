import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./admin.css";


//회원 목록
export default function MemberManage(){


    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //회원 목록 저장 변수
    const [memberList, setMemberList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const [searchType, setSearchType]= useState('all');
    const [keyword, setKeyword] =useState('');



    const fetchMemberList = (page) => {
        const options = {
            url: serverUrl + '/admin/memberManage/'+ page,
            method: 'get',
            params: { searchType, keyword }
        };

        axiosInstance(options)
            .then(res => {
                setMemberList(res.data.resData.memberList);
                setPageInfo(res.data.resData.pageInfo);
               
            })
            .catch(err => {
                console.error("조회 실패", err);
            });
    };

    useEffect(() => {
        fetchMemberList(reqPage);
    }, [reqPage, searchType, keyword]); //  검색 조건 변경도 반영

    const searchMember = (e) => {
        e.preventDefault();
        setReqPage(1); // 페이지를 1로 초기화 → useEffect 실행
        fetchMemberList(1);
    };

    /*
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/admin/memberManage/" + reqPage ;
        options.method = 'get';
        options.params = {searchType,keyword};

        axiosInstance(options)
        .then(function(res){
            setMemberList(res.data.resData.memberList);
            setPageInfo(res.data.resData.pageInfo);
         
        });


    },[reqPage]);

    // 검색버튼 눌렀을 때 
function searchMember(e){
     e.preventDefault();

     let options = {
        url: serverUrl + "/admin/memberManage/" + 1,// 항상 1페이지부터 검색
        method: 'get',
        params: { searchType, keyword }
    }

    axiosInstance(options)
        .then(res => {
            setReqPage(1); // 검색 시 1페이지
            setMemberList(res.data.resData.memberList);
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(err => {
            console.error("검색 실패", err);
        });
}
*/

    return (
        <>
        <div className="page-title">회원 관리</div>
        <div className="search-and-nav">
        <div className="search">
            <form className='form' onSubmit={searchMember}  >
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="all">전체</option>
                        <option value="id">아이디</option>
                        <option value="name">이름</option>
                    </select>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="검색어 입력"
                    />
                    <button type="submit" className="admin-btn">검색</button>
                </form>
            </div>
        </div>
        
            <table className="admin-tbl">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>주소</th>
                        <th>생년월일</th>
                        <th>가입일</th> 
                        <th>등급</th>     
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

// 회원 등급 변경
    function handleChange(e){
        member.memberLevel = e.target.value;

        let options = {};
        options.url = serverUrl + "/admin/memberManage";
        options.method = 'patch';
        options.data = {memberId : member.memberId, memberLevel : member.memberLevel};

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setMemberList([...memberList]);
            }
        });
        

    
}

    return (
        <tr>
            <td>{member.memberNo}</td>
            <td>{member.memberId}</td>
            <td>{member.memberName}</td>
            <td>{member.memberPhone}</td>
            <td>{member.memberEmail}</td>
            <td>{member.memberAddrMain}</td>
            <td>{member.memberBirth.substring(0,10)}</td>
            <td>{member.memberEnrollDate.substring(0,10)}</td>
             <td>
                 <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">등급</InputLabel>
                            <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={member.memberLevel}
                                    label="Grade"
                                    onChange={handleChange}
                                    >
                                <MenuItem value={1}>관리자</MenuItem>
                                <MenuItem value={2}>일반회원</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </td>
        </tr>
    );
}