import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from '../common/PageNavi';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//회원 관심단체 리스트
export default function likeOrgList(){

    /*
    화면에 보여줄 내용
    단체 이름
    단체 썸네일
    단체별 주요 기부 카테고리
    현재 진행중인 사업이 있는지?
    하트
    페이지네이션

    필요한 필수 정보: 회원 번호

    div클릭시 -> 단체소개 페이지로 이동
  */

    //회원 관심단체 리스트
    const [likeOrgList, setLikeOrgList] = useState([]);

    //요청페이지
    const [reqPage, setReqPage] = useState(1);

    //페이지 네비게이션
    const [pageInfo, setPageInfo] = useState({});

    //회원 번호 추출을 위함
    const {loginMember} = useUserStore();
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에 회원 관심단체리스트 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/orgLike/' + reqPage + "/" + loginMember.memberNo;
        options.data = {memberNo : loginMember.memberNo};
        options.method = 'get';
        
        axiosInstance(options)
        .then(function(res){
            setLikeOrgList(res.data.resData.orgLikeList);
            setPageInfo(res.data.resData.pageInfo);
        });
        
        
    },[reqPage]);
    

    return (
            <div>
                <div className="likeOrgList-wrap">
                    {likeOrgList.map(function(likeOrg, index){
                        return <LikeOrg key={"likeOrg" + index} likeOrg={likeOrg} />
                    })}
                </div>
                <div>
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
                </div>
            </div>
    )
}

//회원 관심단체 하나
function LikeOrg(props){

    const likeOrg = props.likeOrg;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //관심단체이므로 초기화면엔 checked로 설정
    const [checked, setChecked] = useState(true);

    function updCheck(e){
        setChecked(e.target.checked);
    }
    
    //해당 단체의 카테고리 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/member/orgDetail/" + likeOrg.orgNo
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
          
        })
    }, [])

    return (
        <div className="likeOrg-wrap">
            <div className="likeOrg-logo">
                <img  src={
                            likeOrg.orgThumbPath
                            ?
                            serverUrl + "/org/thumb/" + likeOrg.orgThumbPath.substring(0,8) + "/" + likeOrg.orgThumbPath
                            :
                            "/images/default_img.png"     
                        } />
            </div>
            <div className="likeOrg-name">
                {likeOrg.orgName}
                <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />}  checked={checked} onChange={updCheck}/>
            </div>
             
        </div>
    )
}