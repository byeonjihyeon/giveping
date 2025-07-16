import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import { Link, useParams } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";


//후원단체 상세페이지
export default function OrgView(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const param = useParams();
    const orgNo = param.orgNo
    const {loginMember} = useUserStore();
    const memberNo = loginMember ? loginMember.memberNo : "";

    const [categoryList, setCategoryList] = useState([]);   //전체 카테고리 정보
    const [org, setOrg] = useState({});                     //단체 1개 정보
    const [orgCategoryList, setOrgCategoryList] = useState([]); //단체 주요 카테고리
    const [ingBizList, setIngBizList] = useState([{}]);     //진행 중인 사업 3개
    const [endBizList, setEndBizList] = useState([{}]);     //종료된 사업 5개
    const [addLike, setAddLike] = useState(false);          //좋아요 눌렀는지 확인할 변수
    const [isReportOpen, setIsReportOpen] = useState(false);//모달창 열기위한 변수

    
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

    //관심 단체 조회
    useEffect(function(){
        if(loginMember){
            let options = {};
            options.url = serverUrl + "/member/selectLikeOrg/" + memberNo;
            options.method = "get";
    
            axiosInstance(options)
            .then(function(res){
                const orgNoList = res.data.resData;
                for(let i=0; i<orgNoList.length; i++){
                    if(orgNo == orgNoList[i].orgNo){
                        setAddLike(true);
                    }
                }
            });
        }
    }, []);
    
    //좋아요 클릭 시 호출 함수
    function addLikeOrg(){
        const data = {memberNo : memberNo, orgNo : org.orgNo};

        let options = {};
        if(!addLike){
            options.url = serverUrl + "/member/addLikeOrg";
            options.method = "post";
            options.data = data;
        }else {
            options.url = serverUrl + "/member/deleteLikeOrg";
            options.method = "delete";
            options.data = data;
        }

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                setAddLike(!addLike);
            }
        });
    }

    //신고창 열기
    function openReportPopup(){
        setIsReportOpen(true);
    }


    return (
        <section className="section org-view-wrap">
            <div style={{display : "flex", justifyContent : "flex-end"}}>
                {loginMember && loginMember.memberLevel == 2 ? 
                <span className="material-icons favorite-heart" onClick={addLikeOrg}>{addLike ? "favorite" : "favorite_border"}</span> : ""}&nbsp;
                {loginMember ? <span className="comment-action-text" style={{display : "block"}} onClick={openReportPopup}> 🚨신고</span> : ""}
                {isReportOpen && <Report setIsReportOpen={setIsReportOpen} org={org}/>}
            </div>
            <div style={{display : "flex"}}>
                <div className="img-favorite-div">
                    <img className="org-thumb-image" src={org.orgThumbPath ? serverUrl + "/org/thumb/" + org.orgThumbPath.substring(0,8) + "/" + org.orgThumbPath : "/images/default_img.png"}/>
                </div>
                <div className="org-info-div">
                    <div>
                        <h2>{org.orgName}</h2>
                        {categoryList.map(function(ctg, index){
                            return  <span key={"ctg"+index}>{orgCategoryList.map(function(code, index){
                                        return  <span key={"code"+index} className={ctg.donateCode == code ? "org-ctg-span" : ""}
                                                    >{ctg.donateCode == code ? "#" + ctg.donateCtg : ""}</span>
                            })}</span>
                        })}
                    </div>
                    <div className="org-temperature">
                        <p style={{width : (org.orgTemperature * 2) + "%"}}>
                            <span className="org-ctg-span" style={{color : "#ff5353ff", border : "1px solid #ff5353ff"}}>{org.orgTemperature}ºC</span>
                            <span className="progress-circle"></span>
                        </p>
                        <div className="progress-bar" style={{marginTop : "8px"}}>
                            <div className="progress-fill" style={{width : org.orgTemperature + "%", backgroundColor : "#ff5353ff", borderRadius : "5px"}}></div>
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
                            <th><h3>홈페이지</h3></th>
                            <td><Link to={org.orgUrl}>{org.orgUrl}</Link></td>
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
                    return  <div key={"ctg"+index} className="org-biz-ctg">
                                <span className={ctg.donateCode == biz.donateCode ? "org-ctg-span" : ""}>{ctg.donateCode == biz.donateCode ? "#" + ctg.donateCtg : ""}</span>
                            </div>
                })}
                <div style={{minHeight : "57px", maxHeight : "300px", overflow : "auto"}}>{biz.bizContent ? <Viewer initialValue={biz.bizContent}/> : ""}</div>
                <div className="org-biz-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width : per + "%"}}></div>
                    </div>
                    <div>
                        <span style={{float : "left", marginBottom : "5px"}}>{(biz.donateMoney || 0).toLocaleString("ko-KR")}원</span>
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
                    return  <div key={"ctg"+index} className="org-biz-ctg">
                                <span className={ctg.donateCode == biz.donateCode ? "org-ctg-span" : ""}>{ctg.donateCode == biz.donateCode ? "#" + ctg.donateCtg : ""}</span>
                            </div>
                })}
                <div style={{minHeight : "57px", maxHeight : "300px", overflow : "auto"}}>{biz.bizContent ? <Viewer initialValue={biz.bizContent}/> : ""}</div>
                <div className="org-biz-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width : per + "%"}}></div>
                    </div>
                    <div>
                        <span style={{float : "left", marginBottom : "5px"}}>{(biz.donateMoney || 0).toLocaleString("ko-KR")}원</span>
                        <span style={{float : "right"}}>{per}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

//신고창
function Report(props){
    const setIsReportOpen = props.setIsReportOpen;
    const org = props.org;

    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    
    const [selectedCode, setSelectedCode] = useState("");   //선택된 신고 코드
    const [codeList, setCodeList] = useState([]);           //신고 코드 리스트 변수 저장하기
    const [detailReason, setDetailReason] = useState("");   //신고 상세 사유 변수

    // 신고 코드 가져오기
    useEffect(function(){
    let option = {};
    option.url = serverUrl + "/member/report";
    option.method = 'get';

    axiosInstance(option)
    .then(function(res){
        setCodeList(res.data.resData);  // 신고 코드 리스트에 저장
    });
    },[])

    //신고 코드 선택 시 호출 함수
    function handleSelectChange(e){
        setSelectedCode(e.target.value);
    }

    //신고 상세 사유 변경 시 호출 함수
    function chgDetailReason(e){
        setDetailReason(e.target.value);
    }

    //신고하기 클릭 시 호출 함수
    async function handleReportClick() {
        if (!selectedCode) {
            Swal.fire({
                title : "알림",
                text : "신고 사유를 선택해주세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
            return;
        }

        if (!detailReason) {
            Swal.fire({
                title : "알림",
                text : "신고 상세 사유를 입력해주세요.",
                icon : "warning",
                confirmButtonText : "확인"
            });
            return;
        }

        Swal.fire({
            title : "단체를 신고하시겠습니까?",
            icon : "question",
            showCancelButton : true,
            confirmButtonText : "신고",
            cancelButtonText : "취소"
        })
        .then(function(res){
            if(res.isConfirmed){
                let options = {};
                options.url = serverUrl + "/member/report";
                options.method = "post";
                options.data = {
                    reportCode : selectedCode,
                    orgNo : org.orgNo,
                    reportMemberNo : loginMember.memberNo,
                    detailReason : detailReason
                };

                axiosInstance(options)
                .then(function(res){
                    if(res.data.resData){
                        closeReportPopup();
                    }
                });
            }
        })
    }

    //신고창 닫기
    function closeReportPopup(){
        setIsReportOpen(false);
    }

    return (
        <div className="report-modal-overlay">
            <div className="report-modal-contents">
                <h3>신고하기</h3>
                <div style={{ margin: "15px 0" }}>
                    <p><strong>신고 단체</strong></p>
                    <div className="report-button-group" style={{height : "25px"}}>
                        <span>단체명: {org.orgName}</span> <br />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <label htmlFor="reportCode" style={{fontSize: '20px', marginTop: '12px'}}><strong>신고 사유 선택</strong></label><br/>
                        <select className="report-select" id="reportCode" value={selectedCode} onChange={handleSelectChange} style={{ width: "150px", fontSize : '14px'}}>
                            <option className="report-option" value="">사유를 선택하세요</option>
                            {codeList.map((code) => (
                                <option className="report-option" key={code.reportCode} value={code.reportCode}>
                                    {code.reportReason}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input className="report-reason" type="text" id="detailReason" name="detailReason" value={detailReason} onChange={chgDetailReason} placeholder="상세 사유 입력"></input>
                    </div>
                </div>
                <div className="report-modal-buttons">
                    <button className="report-button" onClick={handleReportClick}>신고하기</button>
                    <button className="report-button" onClick={closeReportPopup}>닫기</button>
                </div>
            </div>
        </div>
    )
}