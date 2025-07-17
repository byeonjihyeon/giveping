import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";
import { useEffect, useRef, useState } from "react";

export default function MainList(){
    const { isLogined, loginMember, loginOrg } = useUserStore();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const [bizList, setBizList] = useState([]);     // 기부 사업 리스트
    const [orgList, setOrgList] = useState([]);     // 기부 사업 리스트

    const bizSliderRef = useRef(null);
    const orgSliderRef = useRef(null);


    // 조건에 따라 primaryNo 설정 (회원으로 로그인 한 경우만 memberNo 보내기, 나머지는 0 값 보냄) (관리자도 0 값 보내도록 memberLevel 조건식 추가)
    const primaryNo = (isLogined && loginMember && loginMember.memberNo && loginMember.memberLevel == 2)
                        ? loginMember.memberNo
                        : 0;

    // 기부 사업 리스트 (8개) 조회해오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl +'/bizList/'+ primaryNo;
        options.method = 'get';
        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setBizList(res.data.resData);
        });

    }, []);

    
    
    // 기부 단체 리스트 (8개) 조회해오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl +'/orgList/'+ primaryNo;
        options.method = 'get';
        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setOrgList(res.data.resData);
            })
            
    }, []);
    

    // 스크롤 함수 (biz, org 분리)
    function scroll(ref, direction) {
        const scrollAmount = ref.current.offsetWidth;
        ref.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
    });
}
           
    return(
        <>
        <div className="biz-list-container">
            <div className="content-title">요즘 뜨고 있는 기부사업이에요! 🔥 </div>
            <button className="scroll-btn left" onClick={() => scroll(bizSliderRef, "left")}>{"<"}</button>
            <div className="biz-slider" ref={bizSliderRef}>
                <ul className="biz-list">
                    {bizList.map((biz, index) => (
                        <BizItem key={"biz" + index} biz={biz} />
                    ))}
                </ul>
            </div>
            <button className="scroll-btn right" onClick={() => scroll(bizSliderRef, "right")}>{">"}</button>
        </div>
        
        <div className="biz-list-container">
            <div className="content-title">
                {loginMember && loginMember.memberLevel == 2 ? loginMember.memberName + ' 님! 이런 단체는 어떠세요 ? 🔍'   : "관심 분야를 선택하면 맞춤 단체를 추천해드려요 ! 💡"  } 
            </div>
            <button className="scroll-btn left" onClick={() => scroll(orgSliderRef, "left")}>{"<"}</button>
            <div className="biz-slider" ref={orgSliderRef}>
                <ul className="biz-list">
                    {orgList.map((org, index) => (
                        <OrgItem key={"org" + index} org={org} />
                    ))}
                </ul>
            </div>
            <button className="scroll-btn right" onClick={() => scroll(orgSliderRef, "right")}>{">"}</button>
        </div>
        </>
    )
}

function BizItem(props){
    const biz = props.biz;
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;


    // 기부금 달성률 계산
    const goal = biz.bizGoal || 0;
    const donated = biz.donateMoney || 0;
    const percent = goal > 0 ? Math.floor((donated / goal) * 100) : 0;

    return (
        <li className="posting-item" onClick={() => navigate('/biz/view/' + biz.bizNo)}>
            <div className="posting-img">
                <img
                    src={biz.bizThumbPath
                        ? serverUrl + "/biz/thumb/" + biz.bizThumbPath.substring(0, 8) + "/" + biz.bizThumbPath
                        : "/images/default_img.png"}
                />
            </div>
            <div className="posting-info">
                <div className="posting-title" style={{ fontSize: '24px', margin: '10px 0' }}>{biz.bizName}</div>
                <div className="posting-sub-info">
                    <span style={{
                        fontWeight : '700',
                        color : '#7a7a7aff'
                        }}>{biz.orgName}</span>
                    <span style={{
                        marginLeft : '17px',
                        border: '1px solid #007bff',
                        borderRadius: '20px',
                        padding: '4px 10px',
                        display: 'inline-block',
                        color: '#007bff',
                        fontWeight : '500'
                        }}> #{biz.donateCtg}</span>
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

function OrgItem(props){
    const org = props.org;
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    return (
        <li className="posting-item" onClick={function(){navigate('/organization/view/' + org.orgNo)}}>
            <div className="posting-img">
                <img
                    src={org.orgThumbPath
                        ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0, 8) + "/" + org.orgThumbPath
                        : "/images/default_img.png"}
                />
            </div>
            <div className="posting-info">
                <div className="posting-title" style={{ fontSize: '24px', margin: '10px 0' }}>{org.orgName}</div>
                <div className="posting-degree" style={{
                        border: '1px solid #ff5353ff',
                        borderRadius: '20px',
                        padding: '4px 10px',
                        display: 'inline-block',
                        color: '#ff5353ff',
                        fontWeight: '500',
                    }}>
                    <span> {org.orgTemperature}℃</span>
                </div>
                <div className="posting-category" style={{marginTop : '4px'}}>
                    {org.categoryList && org.categoryList.length > 0 ? (
                        org.categoryList.map((ctg, idx) => (
                        <span key={idx} style={{
                        marginRight: '5px',
                        border: '1px solid #007bff',
                        borderRadius: '20px',
                        padding: '4px 10px',
                        display: 'inline-block',
                        color: '#007bff',
                        fontWeight: '500',
                    }}>#{ctg}</span>
                        ))
                    ) : (
                        ''
                    )}
                    </div>
            </div>
        </li>
    );
}
