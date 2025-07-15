import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import { Link, useParams } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";


//후원단체 상세페이지
export default function OrgView(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const param = useParams();
    const orgNo = param.orgNo

    const [categoryList, setCategoryList] = useState([]);   //전체 카테고리 정보
    const [org, setOrg] = useState({});                     //단체 1개 정보
    const [orgCategoryList, setOrgCategoryList] = useState([]); //단체 주요 카테고리
    const [ingBizList, setIngBizList] = useState([{}]);     //진행 중인 사업 3개
    const [endBizList, setEndBizList] = useState([{}]);     //종료된 사업 5개

    
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

    //단체 정보 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/view/" + orgNo;
        options.method = "get"

        axiosInstance(options)
        .then(function(res){
            const data = res.data.resData;
            setOrg(data.org);
            setOrgCategoryList(data.categoryList);
            setIngBizList(data.ingBizList);
            setEndBizList(data.endBizList);
        });
    }, []);
    

    return (
        <section className="section org-view-wrap">
            <span className="comment-action-text" style={{float : "right"}}>신고</span>
            <div style={{display : "flex"}}>
                <img className="org-thumb-image" src={org.orgThumbPath ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0,8) + "/" + org.orgThumbPath : "/images/default_img.png"}/>
                <div className="org-info-div">
                    <div>
                        <h2>{org.orgName}</h2>
                        {categoryList.map(function(ctg, index){
                            return  <span key={"ctg"+index}>{orgCategoryList.map(function(code, index){
                                        return  <span key={"code"+index}>{ctg.donateCode == code ? "#" + ctg.donateCtg : ""} </span>
                            })}</span>
                        })}
                    </div>
                    <div className="org-temperature">
                        <span>{org.orgTemperature}ºC</span>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{width : org.orgTemperature + "%", backgroundColor : "red"}}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="org-margin-div">
                <h3>단체 소개</h3>
                <div className="org-intro-div">{org.orgIntroduce}</div>
            </div>
            <div className="org-margin-div" style={{width : "100%"}}>
                <h3>단체 정보</h3>
                <table className="tbl-org-view">
                    <tbody>
                        <tr>
                            <th style={{width : "30%"}}><h3>사업자 번호</h3></th>
                            <td style={{width : "70%"}}>{org.orgBiznum}</td>
                        </tr>
                        <tr>
                            <th><h3>전화번호</h3></th>
                            <td>{org.orgPhone}</td>
                        </tr>
                        <tr>
                            <th><h3>이메일</h3></th>
                            <td>{org.orgEmail}</td>
                        </tr>
                        <tr>
                            <th><h3>주소</h3></th>
                            <td>{org.orgAddrMain} {org.orgAddrDetail}</td>
                        </tr>
                        {org.orgUrl 
                        ?
                        <tr>
                            <th><h3>홈페이지 주소</h3></th>
                            <td>{org.orgUrl}</td>
                        </tr>
                        : ""
                        }
                    </tbody>
                </table>
            </div>
            <div className="org-margin-div">
                <h3>진행 중 기부 사업</h3>
                <div className={ingBizList.length > 0 ? "org-biz-list" : ""}>
                    {ingBizList.length > 0 ? ingBizList.map(function(biz, index){
                        return  <IngBiz key={"biz"+index} biz={biz} categoryList={categoryList}/>
                    }) : "진행 중인 기부 사업이 없습니다."}
                </div>
            </div>
            <div className="org-margin-div">
                <h3>종료 기부 사업</h3>
                <div className={endBizList.length > 0 ? "org-biz-list" : ""}>
                    {endBizList.length > 0 ? endBizList.map(function(biz, index){
                        return  <EndBiz key={"biz"+index} biz={biz} categoryList={categoryList}/>
                    }) : "종료된 기부 사업이 없습니다."}
                </div>
            </div>
        </section>
    )
}

//진행 중인 기부 사업
function IngBiz(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const biz = props.biz;
    const categoryList = props.categoryList;
    const per = Math.round(biz.donateMoney / biz.bizGoal * 100 * 10) / 10;

    return (
        <div style={{display : "flex"}}>
            <div>
                <img className="org-biz-img" src={biz.bizThumbPath ? serverUrl + "/biz/thumb/" + biz.bizThumbPath.substring(0,8) + "/" + biz.bizThumbPath : "/images/default_img.png"}/>
            </div>
            <div className="org-biz-div">
                <div><Link to={"/biz/view/" + biz.bizNo}><h3>{biz.bizName}</h3></Link></div>
                {categoryList.map(function(ctg, index){
                    return  <div key={"ctg"+index} className="org-biz-ctg">{ctg.donateCode == biz.donateCode ? "#" + ctg.donateCtg : ""}</div>
                })}
                <div style={{minHeight : "57px"}}>{biz.bizContent ? <Viewer initialValue={biz.bizContent}/> : ""}</div>
                <div className="org-biz-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width : per + "%"}}></div>
                    </div>
                    <div>
                        <span style={{float : "left"}}>{(biz.donateMoney || 0).toLocaleString("ko-KR")}원</span>
                        <span style={{float : "right"}}>{per}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

//종료된 기부 사업
function EndBiz(props){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const biz = props.biz;
    const categoryList = props.categoryList;
    const per = Math.round(biz.donateMoney / biz.bizGoal * 100 * 10) / 10;

    return (
        <div style={{display : "flex"}}>
            <div>
                <img className="org-biz-img" src={biz.bizThumbPath ? serverUrl + "/biz/thumb/" + biz.bizThumbPath.substring(0,8) + "/" + biz.bizThumbPath : "/images/default_img.png"}/>
            </div>
            <div className="org-biz-div">
                <div><Link to={"/biz/view/" + biz.bizNo}><h3>{biz.bizName}</h3></Link></div>
                {categoryList.map(function(ctg, index){
                    return  <div key={"ctg"+index} className="org-biz-ctg">{ctg.donateCode == biz.donateCode ? "#" + ctg.donateCtg : ""}</div>
                })}
                <div style={{minHeight : "57px"}}>{biz.bizContent ? <Viewer initialValue={biz.bizContent}/> : ""}</div>
                <div className="org-biz-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width : per + "%"}}></div>
                    </div>
                    <div>
                        <span style={{float : "left"}}>{(biz.donateMoney || 0).toLocaleString("ko-KR")}원</span>
                        <span style={{float : "right"}}>{per}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}