import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from '../common/PageNavi';
import { isAfter, set } from "date-fns";
import { useNavigate } from "react-router-dom";

//회원 관심단체 리스트
export default function likeOrgList(){

    //회원 관심단체 리스트
    const [likeOrgList, setLikeOrgList] = useState([]);

    //요청페이지
    const [reqPage, setReqPage] = useState(1);

    //페이지 네비게이션
    const [pageInfo, setPageInfo] = useState({});

    //회원 번호 추출을 위함
    const {loginMember} = useUserStore();

    //재랜더링 유도변수
    const [reload, setReload] = useState(false);
    
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
        
        
    },[reqPage, reload]);
    

    return (
        <div className="like-org-list-wrap"> 
            <div className="title">관심단체</div>
            {
            !likeOrgList ?
            ""    
            :likeOrgList.length > 0 ?
                <div>
                    <div className="likeOrgList-wrap">
                        {likeOrgList.map(function(likeOrg, index){
                            return <LikeOrg key={"likeOrg" + index} likeOrg={likeOrg} loginMember={loginMember} likeOrgList={likeOrgList} setLikeOrgList={setLikeOrgList}
                                             reload={reload} setReload={setReload} reqPage={reqPage} setReqPage={setReqPage} />
                        })}
                    </div>
                    <div>
                        <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
                    </div>
                </div>
                :
                <div className="no-like-org">현재 관심단체가 존재하지 않습니다.</div>
            } 
        </div>       
    )
}

//회원 관심단체 하나
function LikeOrg(props){
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    
    const likeOrg = props.likeOrg;  //관심단체              
    const bizList = props.likeOrg.bizList;  //관심단체 사업리스트
    const loginMember = props.loginMember; //회원번호 추출하기위함
    const likeOrgList= props.likeOrgList;
    const setLikeOrgList = props.setLikeOrgList;
    const reload= props.reload;
    const setReload = props.setReload;
    const reqPage = props.reqPage;
    const setReqPage = props.setReqPage;
    const activeBizList = bizList.map(function(biz,index){  //현재 진행중인 사업리스트,
    return isAfter(biz.bizDonateEnd, new Date());           //isAfter(사업모금종료날짜, 오늘날짜)  == 사업모금날짜가 오늘날짜보다 미래인지? true or false
    })                                                        
                    
    const axiosInstance = createInstance();
     
    //하트 클릭시 동작함수 (하트눌렀을때 제거)
    function delLikeOrg(){
        
    
        let options = {};
        options.url = serverUrl + "/member/delLikeOrg/" + likeOrg.orgNo + "/" + loginMember.memberNo;
        options.method = "delete";
    
        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){   //삭제성공시
                let newLikeOrgList = likeOrgList.filter(function(dLikeOrg, dIndex){
                    return likeOrg.orgNo != dLikeOrg.orgNo;
                })
                setLikeOrgList(newLikeOrgList);
                
                //삭제후,현재페이지의 리스트가 0개 && 현재페이지가 1페이지가 아니라면,
                if(newLikeOrgList.length == 0 && reqPage > 1){
                    setReqPage(prev => prev -1);
                }else{
                    setReload(!reload);
                }

           }
        });
    }

   
    return (
        <div className="likeOrg-wrap" onClick={function(){
            navigate("/organization/view/" + likeOrg.orgNo);
        }}>
            <div className="likeOrg-logo">
                {
                    activeBizList != null && activeBizList.length > 0   //==현재 진행중인 사업이 있어?
                    ?
                    <div className="biz-ing">모금 진행중</div>
                    :
                    ""
                }               
                <img  src={
                            likeOrg.orgThumbPath    //기존 썸네일 가지고있다면?
                            ?
                            serverUrl + "/org/thumb/" + likeOrg.orgThumbPath.substring(0,8) + "/" + likeOrg.orgThumbPath
                            :
                            "/images/default_img.png"     
                        } />
            </div>
            <div className="likeOrg-info">
                <div className="name">{likeOrg.orgName}</div>
                 <div className="org-ctg-wrap">
                    {likeOrg.categoryList.map(function(category, index){
                        return <div className="org-ctg" key={"category" + index}>{category}</div>
                    })}
                </div>
                <div className="delBtn">
                    <img src='/images/clear_24dp_C0C0C0.png' onClick={delLikeOrg} />
                </div>
            </div> 
        </div>
    )
}