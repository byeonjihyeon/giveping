import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import './biz.css';

export default function BizList() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [donateBizList, setDonateBizList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const { isLogined } = useUserStore();
    const [searchType, setSearchType] = useState("bizTitle");
    const [categories, setCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);  // 검색 상태 여부

    const location = useLocation();
    const codeArr = location.state;
   
    useEffect(function(){
        if(codeArr != null){
            setCategories(codeArr);
        }
    }, [])

    const [keyWord, setKeyWord] = useState({
        bizTitle: "",
        orgName: ""
    });

    const donateCategoryMap = {
        D01: '아동 👧',
        D02: '노인 👨‍🦳',
        D03: '난민 🌍',
        D04: '환경 🌳',
        D05: '장애인 🤟',
        D06: '교육 🎨',
        D07: '재해지원 💧'
    };

    // 카테고리 -> 카테고리 여러 개 눌렀을 때, 직렬화시키는 하는 함수
    function paramsSerializer(params) {
    const parts = [];

    for (const key in params) {
        const value = params[key];
        if (Array.isArray(value)) {
        // 배열이면 key=value1&key=value2 형태로 변환
        value.forEach(function (v) {
            parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
        });
        } else if (value !== undefined && value !== null) {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    }

    return parts.join("&");
    }

    useEffect(function () {
        if(isSearching){    // isSearching 이 true => 검색 상태
            fetchSearchData(reqPage);
        }else{

            async function fetchData() {
                const res = await axiosInstance.get(
                serverUrl + "/biz/list/" + reqPage,
                {
                    params: { categories },
                    paramsSerializer: paramsSerializer
                }
                );
                setDonateBizList(res.data.resData.donateBizList);
                setPageInfo(res.data.resData.pageInfo);
            }
        
            fetchData();
        }
    }, [reqPage, categories]);


    function handleInputChange(e) {
        const value = e.target.value;
        setKeyWord({
            bizTitle: searchType === "bizTitle" ? value : "",
            orgName: searchType === "orgName" ? value : ""
        });
    }

    function handleSearchTypeChange(e) {
        setSearchType(e.target.value);
        setKeyWord({ bizTitle: "", orgName: "" });
    }

    function toggleCategory(code) {

        // 카테고리 클릭 시 -> 검색창 초기화, 검색 상태 해제
        setKeyWord({ bizTitle: "", orgName: "" });
        setIsSearching(false);

        setCategories(prev =>
            prev.includes(code)
                ? prev.filter(c => c !== code)
                : [...prev, code]
        );
        setReqPage(1);
    }

    function srchSubmit() {
    setIsSearching(true);
    setCategories([]); // 카테고리 초기화
    setReqPage(1);  // 검색은 첫 페이지부터
    fetchSearchData(1);
    }

    function fetchSearchData(page) {
    let options = {
      url: serverUrl + "/biz/search/"+page,
      method: 'post',
      data: {
        bizTitle: keyWord.bizTitle,
        orgName: keyWord.orgName
      }
    };

    axiosInstance(options)
      .then(function(res) {
        setDonateBizList(res.data.resData.donateBizList);
        setPageInfo(res.data.resData.pageInfo);
      });
  }

    return (
        <section className="section board-list">
                <div className="page-title">기부 사업</div>
                <div className="filter-search-wrapper">

                <div className="category-filter">
                    {Object.entries(donateCategoryMap).map(([code, label]) => (
                        <button
                        key={code}
                        style={{
                            backgroundColor: categories.includes(code) ? '#007bff' : '#ffffffff',
                            color: categories.includes(code) ? 'white' : '#333',
                            border: '1px solid',
                            borderColor: categories.includes(code) ? '#0056b3' : '#ccc',
                            padding: '10px 20px',
                            margin: '0 6px 6px 0',
                            cursor: 'pointer',
                            borderRadius: '30px',
                            fontWeight: categories.includes(code) ? 'bold' : 'normal',
                            fontSize: '1rem',
                            minWidth: 'center',
                        }}
                        onClick={() => toggleCategory(code)}
                        >
                        {label}
                        </button>

                        ))}
                    </div>

                    <div className="search-box" style={{ marginBottom: '20px' }}>
                        <select name="searchType" id="searchType" value={searchType} onChange={handleSearchTypeChange}>
                            <option value="bizTitle">사업명</option>
                            <option value="orgName">단체명</option>
                        </select>
                        <input
                            type="text"
                            name={searchType === "bizTitle" ? "bizTitle" : "orgName"}
                            placeholder={searchType === "bizTitle" ? "기부 사업명을 입력하세요" : "단체명을 입력하세요"}
                            value={searchType === "bizTitle" ? keyWord.bizTitle : keyWord.orgName}
                            onChange={handleInputChange}
                        />
                        <input type="button" value="검색" onClick={srchSubmit} />
                    </div>
            </div>

            <div className="board-list-wrap">
                <ul className="posting-wrap grid-3x4">
                    {donateBizList.map(function(donateBiz, index){
                        return <BoardItem key={"donateBiz" + index} donateBiz={donateBiz} serverUrl={serverUrl} />
                    })}
                </ul>
            </div>

            <div className="board-paging-wrap">
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
            
        </section>
    );
}

function BoardItem(props) {
    const { donateBiz, serverUrl } = props;
    const navigate = useNavigate();

    // 기부금 달성률 계산
    const goal = donateBiz.bizGoal || 0;
    const donated = donateBiz.donateMoney || 0;
    const percent = goal > 0 ? Math.floor((donated / goal) * 100) : 0;

    return (
        <li className="posting-item" onClick={() => navigate('/biz/view/' + donateBiz.bizNo)}>
            <div className="posting-img">
                <img
                    src={donateBiz.bizThumbPath
                        ? serverUrl + "/biz/thumb/" + donateBiz.bizThumbPath.substring(0, 8) + "/" + donateBiz.bizThumbPath
                        : "/images/default_img.png"}
                />
            </div>
            <div className="posting-info">
                <div className="posting-title" style={{ fontSize: '24px', margin: '10px 0' }}>{donateBiz.bizName}</div>
                <div className="posting-sub-info">
                    <span style={{
                        fontWeight : '700',
                        color : '#7a7a7aff'
                        }}>{donateBiz.orgName}</span>
                    <span style={{
                        marginLeft : '17px',
                        border: '1px solid #007bff',
                        borderRadius: '20px',
                        padding: '4px 10px',
                        display: 'inline-block',
                        color: '#007bff',
                        fontWeight : '500'
                        }}> #{donateBiz.donateCtg}</span>
                    <br />
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="donate-stats">
                        <span>{percent}%</span>
                        <span>{donated.toLocaleString()}원</span>
                    </div>
                </div>
            </div>
        </li>
    );
}
