import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    const [keyWord, setKeyWord] = useState({
        bizTitle: "",
        orgName: ""
    });

    const donateCategoryMap = {
        D01: '아동',
        D02: '노인',
        D03: '난민',
        D04: '환경',
        D05: '장애인',
        D06: '교육',
        D07: '재해 지원'
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
        setCategories(prev =>
            prev.includes(code)
                ? prev.filter(c => c !== code)
                : [...prev, code]
        );
        setReqPage(1);
    }

    function srchSubmit() {
    let options = {
      url: serverUrl + "/biz/search",
      method: 'post',
      data: {
        bizTitle: keyWord.bizTitle,
        orgName: keyWord.orgName
      }
    };

    axiosInstance(options)
      .then(function(res) {
        console.log(res.data.resData);
        setDonateBizList(res.data.resData.donateBizList);
        setPageInfo(res.data.resData.pageInfo);
      });
  }

    return (
        <section className="section board-list">
            <div className="page-title">기부 사업</div>

            <div className="category-filter">
                {Object.entries(donateCategoryMap).map(([code, label]) => (
                    <button
                    key={code}
                    style={{
                        backgroundColor: categories.includes(code) ? '#007bff' : '#f0f0f0',
                        color: categories.includes(code) ? 'white' : '#333',
                        border: '1px solid',
                        borderColor: categories.includes(code) ? '#0056b3' : '#ccc',
                        padding: '6px 14px',
                        margin: '0 6px 6px 0',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: categories.includes(code) ? 'bold' : 'normal',
                        boxShadow: categories.includes(code) ? '0 0 8px rgba(0,123,255,0.6)' : 'none',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    onClick={() => toggleCategory(code)}
                    >
                    {label}
                    </button>

                ))}
            </div>

            <div className="board-list-wrap">
                <ul className="posting-wrap grid-3x4">
                    {donateBizList.map((donateBiz, index) => (
                        <BoardItem key={"donateBiz" + index} donateBiz={donateBiz} serverUrl={serverUrl} />
                    ))}
                </ul>
            </div>

            <div className="board-paging-wrap">
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>

            <div className="search-box">
                <select value={searchType} onChange={handleSearchTypeChange}>
                    <option value="bizTitle">기부 사업명</option>
                    <option value="orgName">단체명</option>
                </select>
                <input
                    type="text"
                    placeholder={searchType === "bizTitle" ? "기부 사업명을 입력하세요" : "단체명을 입력하세요"}
                    value={searchType === "bizTitle" ? keyWord.bizTitle : keyWord.orgName}
                    onChange={handleInputChange}
                />
                <input type="button" value="검색" onClick={srchSubmit} />
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


    const bizStatusMap = {
        0: '미승인',
        1: '승인',
        2: '반려',
        3: '탈퇴 요청',
        4: '탈퇴',
    };

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
                <div className="posting-title">{donateBiz.orgName}</div>
                <div className="posting-sub-info">
                    <span>{donateBiz.bizName}</span>
                    <span> #{donateBiz.donateCtg}</span>
                    <br />
                    {/* 
                    <span>모금 기간 : {donateBiz.bizDonateStart} ~ {donateBiz.bizDonateEnd}</span>
                    <br />
                    */}
                    <span>목표 금액 : {goal.toLocaleString()}원</span>
                    <br />
                    {/* 
                    <span>모금액 : {donated.toLocaleString()}원</span>
                    <br />
                    */}
                    <span>달성률 {percent}%</span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: percent }}></div>
                    </div>
                </div>
            </div>
        </li>
    );
}
