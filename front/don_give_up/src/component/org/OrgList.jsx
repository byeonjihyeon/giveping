import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";


//단체 소개 게시글 목록
export default function OrgList(){

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

   
    const [categoryList, setCategoryList]= useState([]);
    const [orgList, setOrgList] = useState([]);         //게시글 리스트 저장 변수
    const [reqPage, setReqPage] = useState(1);              //요청 페이지
    const [pageInfo, setPageInfo] = useState({});           //페이지 네비게이션
    //const {isLogined} = useUserStore();                     //로그인 여부(글쓰기 버튼 표출을 위함)

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/organization/list/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setOrgList(res.data.resData.orgList);
            setPageInfo(res.data.resData.pageInfo);
        });
        
        /*
        useEffect 함수의 첫번 째 매개변수로 전달한 function이 실행되는 조건
        (1) 컴포넌트 첫 랜더링(마운트) 이후
        (2) 두번 째 매개변수로 전달한 의존성 배열 요소가 변경되었을 때
        */
    }, [reqPage]);

    return(
        <section className="section org-list">
            <div className="page-title">후원단체</div>

            <div className="org-list-wrap">
                <ul className="posting-wrap grid-3x4">
                    {orgList.map(function(org, index){
                        //게시글 1개에 대한 JSX를 BoardItem이 return한 JSX로
                        return <BoardItem key={"org"+index} org={org} serverUrl={serverUrl} />
                    })}
                </ul>
            </div>
            <div className="org-paging-wrap">
                    {/* 페이지 네비게이션 제작 컴포넌트 별도 분리하여 작성하고, 필요 시 재사용 */}
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </section>
    )
}

//게시글 1개
function BoardItem(props) {
   
    const orgCtg =props.orgCtg;
    const org = props.org;
    const serverUrl = props.serverUrl; 
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            //상세보기 (BoardView) 컴포넌트 전환하며, 게시글 번호 전달
            navigate('/orgview/' + org.orgNo);
        }}>
            <div className="posting-img">
                {/* 썸네일 이미지가 등록된 경우에는 백엔드로 요청하고, 등록되지 않은 경우에는 기본 이미지 표기되도록 처리 */}
                <img src={org.orgThumbPath ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0,8) + "/" + org.orgThumbPath
                                               : "/images/default_img.png"}/>
            </div>
            <div className="posting-info">
                <div className="posting-title">{org.orgName}</div>
                <div className="posting-sub-info">
                
                {org.categoryList && org.categoryList.map((orgCtg, idx) => (
                <span key={idx}>#{orgCtg} </span>
        ))}
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width : org.orgTemperature + "%", backgroundColor : "red"}}></div>
                    </div>
                    <span>{org.orgTemperature}ºC</span>
                </div>
            </div>
        </li>
    );
}