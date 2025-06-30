import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";



export default function BizList(){ // 기부 사업 리스트 (메뉴 -> 기부 사업 클릭 시 호출되는 jsx)
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [donateBizList, setDonateBizList] = useState([]);     // 기부 사업글 리스트 저장 변수 
    const [reqPage, setReqPage] = useState(1);                  // 요청 페이지
    const [pageInfo, setPageInfo] = useState({});               // 페이지 네비게이션
    const {isLogined} = useUserStore();                         // 로그인 여부(??? 사용할지말지고민중)

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/biz/list/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res);
            setDonateBizList(res.data.resData.donateBizList);
            setPageInfo(res.data.resData.pageInfo);
        })
    }, [reqPage]);

    return(
        <section className="section board-list">
            <div className="page-title">기부 사업</div>
            <div className="board-list-wrap">
                <ul className="posting-wrap">
                    {donateBizList.map(function(donateBiz, index){
                        // 게시글 1개에 대한 JSX를 BoardItem이 return한 JSX로
                        return <BoardItem key={"donateBiz"+index} donateBiz={donateBiz} serverUrl={serverUrl} />
                    })}
                </ul>
            </div>
            <div className="board-paging-wrap">
                {/* 페이지 네비게이션 제작 컴포넌트 별도 분리하여 작성하고, 필요 시 재사용 */}
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </section>


    )
}



//게시글 1개
function BoardItem(props) {
    const donateBiz = props.donateBiz;
    const serverUrl = props.serverUrl;
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            // 상세 보기 (BoardView) 컴포넌트 전환하며, 게시글 번호 전달
            navigate('/biz/view/' + donateBiz.bizNo);

        }}>
            <div className="posting-img">
                {/* 썸네일 이미지가 등록된 경우에는 백엔드로 요청하고, 등록되지 않은 경우에는 기본 이미지 표기되도록 처리 */}
                <img src={donateBiz.bizThumbPath ? serverUrl + "/biz/thumb/" + donateBiz.bizThumbPath.substring(0,8) + "/" + donateBiz.bizThumbPath  
                                               : "/images/default_img.png"} />
            </div>
            <div className="posting-info">
                <div className="posting-title">{donateBiz.bizName}</div>
                <div className="posting-sub-info">
                    <span>{donateBiz.orgName}</span>
                    <span>{donateBiz.donateCode}</span>
                    <span>{donateBiz.bizContent}</span>
                    <span>{donateBiz.bizDonateStart}</span>
                    <span>{donateBiz.bizDonateEnd}</span>
                    <span>{donateBiz.bizStart}</span>
                    <span>{donateBiz.bizEnd}</span>
                    <span>{donateBiz.bizGoal}</span>
                    <span>{donateBiz.bizStatus}</span>
                    <span>{donateBiz.bizRegDate}</span>
                    <span>{donateBiz.bizEdit}</span>
                </div>
            </div>
        </li>
    );
}