import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import { useParams } from "react-router-dom";


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
        <section style={{width : "1200px", margin : "0 auto", marginTop : "20px"}}>
            <div style={{display : "flex"}}>
                <img className="org-thumb-image" src={org.orgThumbPath ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0,8) + "/" + org.orgThumbPath : "/images/default_img.png"}/>
                <div>
                    <h3>{org.orgName}</h3>
                    {categoryList.map(function(ctg, index){
                        return  <span key={"ctg"+index}>{orgCategoryList.map(function(code, index){
                                    return  <span key={"code"+index}>{ctg.donateCode == code ? "#" + ctg.donateCtg : ""}&nbsp;</span>
                        })}</span>
                    })}
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{width : org.orgTemperature + "%", backgroundColor : "red"}}></div>
                </div>
            </div>
            <div>{org.orgIntroduce}</div>
            <div>주요 프로젝트 및 정보</div>
            <div>
                
            </div>
        </section>
    )
}