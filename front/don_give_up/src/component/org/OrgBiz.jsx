import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

//기부 사업 보기
export default function OrgBiz(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const {loginOrg} = useUserStore();
    const orgNo = loginOrg.orgNo;

    //페이지 정보를 저장할 변수
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    //기부 사업 조회 리스트를 저장할 변수
    const [bizList, setBizList] = useState([]);

    //각 버튼 클릭 시 바뀔 value 값을 저장할 변수
    const [clickBtn, setClickBtn] = useState("allBiz");

    //초기에는 전체 리스트를 보여주고
    //버튼 클릭할 때마다 clickBtn 값이 바뀌면 해당하는 리스트 보여주기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/bizList/" + orgNo + "/" + clickBtn + "/" + reqPage;
        options.method = "get";
    
        axiosInstance(options)
        .then(function(res){
            setBizList(res.data.resData.bizList);
            setPageInfo(res.data.resData.pageInfo);
        });
    }, [clickBtn, reqPage]);

    //버튼 클릭 시 호출 함수
    function selectBiz(e){
        setClickBtn(e.target.value);
        setReqPage(1);
    }

    return (
        <div>
            <h2 className="page-title" style={{textAlign : "left", marginLeft : "20px"}}>기부 사업 보기</h2>
            <div style={{height : "570px", width : "800px", margin : "20px auto"}}>
                <div style={{float : "right", marginBottom : "5px"}}>
                    <Button variant="contained" type="button" className="chgBtn" value="allBiz" onClick={selectBiz}>전체</Button>
                    <Button variant="contained"  type="button" className="chgBtn" value="ingBiz" onClick={selectBiz} style={{margin : "0 5px"}}>진행 중</Button>
                    <Button variant="contained"  type="button" className="chgBtn" value="doneBiz" onClick={selectBiz}>종료</Button>
                </div>
                <table className="tbl-donate">
                    <thead>
                        <tr>
                            <th style={{width : "5%"}}>번호</th>
                            <th>사업명</th>
                            {clickBtn == "allBiz"
                            ?   <>
                                <th style={{width : "15%"}}>등록일</th>
                                <th style={{width : "10%"}}>상태</th>
                                </>
                            :   <>
                                <th style={{width : "15%"}}>모금 시작일</th>
                                <th style={{width : "15%"}}>모금 종료일</th>
                                {clickBtn == "doneBiz"
                                ? <>
                                <th style={{width : "10%"}}>상태</th> 
                                <th style={{width : "10%"}}>입금 여부</th>
                                </>
                                : ""}
                                </>}
                            <th style={{width : "15%"}}>상세페이지</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bizList.map(function(biz, index){
                            function bizView(){
                                navigate("/biz/view/" + biz.bizNo);
                            }

                            return  <tr key={"biz"+index}>
                                        <td>{biz.rnum}</td>
                                        <td>{biz.bizName}</td>
                                        {clickBtn == "allBiz" ? <AllBiz biz={biz}/>
                                                            : <ApprovalBiz biz={biz} clickBtn={clickBtn}/>}
                                        {/* biz.bizStatus가 4 (삭제 완료된 상태) 일 경우, 버튼 숨기기 */}
                                        <th>
                                            {biz.bizStatus === 4 ? (
                                                    <>-</>
                                                ) : (
                                                    <Button variant="contained" onClick={bizView} id="detail-btn">
                                                    상세 페이지
                                                    </Button>
                                                )}
                                        </th>
                                    </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </div>
    )
}

//전체 기부 사업 리스트
//번호 사업명 등록일 상태 상세페이지
//사업 승인 여부(0 : 미확인, 1 : 승인, 2 : 반려, 3 : 삭제 요청, 4 : 삭제)
function AllBiz(props){
    const biz = props.biz;
    return (
        <>
        <td>{biz.bizEnrollDate}</td>
        <td>{biz.bizStatus == 0 ? "미승인" :
             biz.bizStatus == 1 ? "승인" :
             biz.bizStatus == 2 ? "반려" : 
             biz.bizStatus == 3 ? "삭제 요청" : "삭제"}
        </td>
        </>
    )
}

//진행 중, 종료 기부 사업 리스트
//번호 사업명 모금시작일 모금종료일 상세페이지
function ApprovalBiz(props){
    const biz = props.biz;
    const clickBtn = props.clickBtn;

    return (
        <>
            <td>{biz.bizDonateStart}</td>
            <td>{biz.bizDonateEnd}</td>
            {clickBtn == "doneBiz"
            ? <>
              <td>{biz.bizStatus == 0 ? "미승인" :
                   biz.bizStatus == 1 ? "승인" :
                   biz.bizStatus == 2 ? "반려" : 
                   biz.bizStatus == 3 ? "삭제 요청" : "삭제"}
              </td> 
              <td>{biz.payoutYN == 1 ? "O" : "X"}</td>
              </>
            : ""}
        </>
    )
}