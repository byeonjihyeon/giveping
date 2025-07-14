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

    const [orgList, setOrgList] = useState([]);             //게시글 리스트 저장 변수
    const [reqPage, setReqPage] = useState(1);              //요청 페이지
    const [pageInfo, setPageInfo] = useState({});           //페이지 네비게이션
    const [categoryList, setCategoryList] = useState([]);   //기부 카테고리 리스트
    const [checkCtgList, setCheckCtgList] = useState([]);   //선택한 카테고리
    const [searchOrgName, setSearchOrgName] = useState(""); //단체명 검색
    const [isClick, setIsClick] = useState(false);

    //기부 카테고리 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setCategoryList(res.data.resData);
        })
    }, []);

    //후원 단체 리스트 조회
    useEffect(function(){
        console.log(isClick);
        const data = {reqPage : reqPage, searchOrgName : searchOrgName, checkCtgList : checkCtgList};

        let options = {};
        options.url = serverUrl + "/org/organization/list";
        options.method = 'post';
        options.data = data;

        axiosInstance(options)
        .then(function(res){
            setOrgList(res.data.resData.orgList);
            setPageInfo(res.data.resData.pageInfo);
        });
    }, [reqPage, checkCtgList, isClick]);

    //선택한 카테고리 저장
    function toggleCategory(code){
        setCheckCtgList(function (prev){
            if (prev.includes(code)){
                return prev.filter(function(item){
                    return item !== code;
                });
            }else {
                return [...prev, code];
            }
        });
    }

    function chgOrgName(e){
        setSearchOrgName(e.target.value);
    }

    function chgIsClick(){
        console.log(searchOrgName);
        setIsClick(!isClick);
    }

    return(
        <section className="section organization-list">
            <div className="page-title">후원단체</div>
            <div className="filter-search-wrapper">
                <div className="category-filter">
                    {categoryList.map(function(ctg, index){
                        return  <button key={"ctg"+index}
                                        style={{backgroundColor: checkCtgList.includes(ctg) ? '#007bff' : '#ffffffff',
                                                color: checkCtgList.includes(ctg) ? 'white' : '#333',
                                                border: '1px solid',
                                                borderColor: checkCtgList.includes(ctg) ? '#0056b3' : '#ccc',
                                                padding: '10px 20px',
                                                margin: '0 6px 6px 0',
                                                cursor: 'pointer',
                                                borderRadius: '30px',
                                                fontWeight: checkCtgList.includes(ctg) ? 'bold' : 'normal',
                                                fontSize: '1rem',
                                                minWidth: 'center',}}
                                        onClick={function(){toggleCategory(ctg.donateCode);}}
                                >{ctg.donateCtg}</button>
                    })}
                </div>
                <div className="search-box">
                    <input type="text" value={searchOrgName} onChange={chgOrgName} placeholder="단체명을 입력하세요"/>
                    <input type="button" value="검색" onClick={chgIsClick}/>
                </div>
            </div>

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
    const org = props.org;
    const serverUrl = props.serverUrl; 
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            //상세보기 (BoardView) 컴포넌트 전환하며, 게시글 번호 전달
            navigate('/organization/view/' + org.orgNo);
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
                        <div className="progress-fill" style={{width : org.orgTemperature + "%",
                                                                backgroundColor : org.orgTemperature < 20 ? "green"
                                                                                : org.orgTemperature >= 20 && org.orgTemperature < 40 ? "lightgreen"
                                                                                : org.orgTemperature >= 40 && org.orgTemperature < 60 ? "yellow"
                                                                                : org.orgTemperature >= 60 && org.orgTemperature < 80 ? "orange" : "red"}}></div>
                    </div>
                    <span>{org.orgTemperature}ºC</span>
                </div>
            </div>
        </li>
    );
}