import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from '../common/PageNavi';
import { isAfter } from "date-fns";

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
        <>
            {
            !likeOrgList ?
            ""    
            :likeOrgList.length > 0 ?
                <div>
                    <div className="likeOrgList-wrap">
                        {likeOrgList.map(function(likeOrg, index){
                            return <LikeOrg key={"likeOrg" + index} likeOrg={likeOrg} loginMember={loginMember} likeOrgList={likeOrgList} setLikeOrgList={setLikeOrgList} />
                        })}
                    </div>
                    <div>
                        <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
                    </div>
                </div>
                :
                <div>현재 관심단체가 존재하지 않습니다.</div>
            } 
        </>       
    )
}

//회원 관심단체 하나
function LikeOrg(props){

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    
    const likeOrg = props.likeOrg;  //관심단체              
    const bizList = props.likeOrg.bizList;  //관심단체 사업리스트
    const loginMember = props.loginMember; //회원번호 추출하기위함
    const likeOrgList= props.likeOrgList;
    const setLikeOrgList = props.setLikeOrgList;
    const activeBizList = bizList.map(function(biz,index){  //현재 진행중인 사업리스트, 
    return isAfter(biz.bizDonateEnd, new Date());           //isAfter(사업모금종료날짜, 오늘날짜)  == 사업모금날짜가 오늘날짜보다 미래인지? true or false
    })                                                        
                    
    const axiosInstance = createInstance();
     
    //관심단체이므로 초기화면엔 checked로 설정
    const [checked, setChecked] = useState(true);

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
            }
        });

        
    }

   
    return (
        <div className="likeOrg-wrap">
            <div className="likeOrg-logo">
                {
                    activeBizList != null && activeBizList.length > 0   //==현재 진행중인 사업이 있어?
                    ?
                    <div>모금 진행중</div>
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
            <div className="likeOrg-name">
                <div>{likeOrg.orgName}</div>
                <img src='/images/favorite_38dp_EA3323.png' onClick={delLikeOrg} />
                 <div className="org-ctg-wrap">
                    {likeOrg.categoryList.map(function(category, index){
                        return <div className="org-ctg" key={"category" + index}>{category}</div>
                    })}
                </div>
            </div> 
        </div>
    )
}