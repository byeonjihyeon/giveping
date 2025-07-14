import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//기부 사업 통계
export default function OrgData(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const {loginOrg} = useUserStore();
    const orgNo = loginOrg.orgNo;

    //조회한 데이터 저장할 변수
    const [data, setData] = useState({});

    const [money, setMoney] = useState(0);          //모금액 전체
    const [goal, setGoal] = useState(0);            //목표금액 전체
    const [avgMoney, setAvgMoney] = useState(0);    //평균 진행률

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/data/" + orgNo;
        options.method = "get";
        
        axiosInstance(options)
        .then(function(res){
            setData(res.data.resData);
            let dMoney = 0;
            let dGoal = 0;
            let dAvgMoney = 0;
            for(let i=0; i<res.data.resData.donateMoneyList.length; i++){
                dMoney += Number(res.data.resData.donateMoneyList[i].donateMoney);
                dGoal += Number(res.data.resData.donateMoneyList[i].bizGoal);
            }
            dAvgMoney = Math.round(dMoney / dGoal * 100 * 10) / 10;
            setMoney(dMoney);
            setGoal(dGoal);
            setAvgMoney(dAvgMoney);
            /*res.data.resData.
            allBiz : 등록한 전체 기부 사업 갯수
            notApproveBiz : 미승인 기부 사업 갯수
            rejectBiz : 반려된 기부 사업 갯수
            approveBiz : 승인된 기부 사업 갯수
            ingBiz : 진행 중인 기부 사업 갯수
            donateEndBiz : 모금 종료된 기부 사업 갯수
            endBiz : 사업 종료된 기부 사업 갯수
            payEndBiz : 입금 처리된 기부 사업 갯수
            donateCodeCnt : 카테고리별 기부 사업 갯수(donateCode : 기부 코드, donateCtg : 기부 카테고리, codeCnt : 해당 코드 갯수)
            donateMoneyList : 사업별 목표 금액 및 모금액
            */
        });
    }, []);
    
    const notApprove = Math.round(data.notApproveBiz / data.allBiz * 100 * 10) / 10;    //미승인%
    const reject = Math.round(data.rejectBiz / data.allBiz * 100 * 10) / 10;            //반려%
    const approve = Math.round(data.approveBiz / data.allBiz * 100 * 10) / 10;          //승인%
    const rest = data.allBiz - data.notApproveBiz - data.rejectBiz - data.approveBiz;   //나머지 갯수
    const etc = Math.round(rest / data.allBiz * 100 * 10) / 10;                         //기타%
    const ing = Math.round(data.ingBiz / data.approveBiz * 100 * 10) / 10;              //진행 중%
    const donateEnd = Math.round(data.donateEndBiz / data.approveBiz * 100 * 10) / 10;  //모금 종료%
    const end = Math.round(data.endBiz / data.approveBiz * 100 * 10) / 10;              //사업 종료%
    const notPay = data.donateEndBiz - data.payEndBiz;                                  //미입금 처리 갯수
    const payNotEnd = Math.round(notPay / data.donateEndBiz * 100 * 10) / 10;           //미입금%
    const payEnd = Math.round(data.payEndBiz / data.donateEndBiz * 100 * 10) / 10;      //입금%


    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff'];

    return (
        <section className="section data-wrap">
            <h2 className="page-title">기부 사업 통계</h2>
            {data.allBiz == 0 ? "" :
            <div>
                <span className="data-title">전체 기부 사업 {data.allBiz}건</span> <br/>
                <span className="span-circle" style={{backgroundColor : "#AFCBFF"}}></span><span> 미승인 ({data.notApproveBiz}건)</span>
                <span className="span-circle" style={{backgroundColor : "#FFFFD1"}}></span><span> 반려 ({data.rejectBiz}건)</span>
                <span className="span-circle" style={{backgroundColor : "#B5EAD7"}}></span><span> 승인 ({data.approveBiz}건)</span>
                <span className="span-circle" style={{backgroundColor : "#f8f9fa"}}></span><span> 기타 ({rest}건)</span>
                <div className="donate-data">
                    {data.notApproveBiz == 0 ? "" : <div style={{width : notApprove + "%", backgroundColor : "#AFCBFF"}}>{notApprove}%</div>}
                    {data.rejectBiz == 0 ? "" : <div style={{width : reject + "%", backgroundColor : "#FFFFD1"}}>{reject}%</div>}
                    {data.approveBiz == 0 ? "" : <div style={{width : approve + "%", backgroundColor : "#B5EAD7"}}>{approve}%</div>}
                    {rest == 0 ? "" : <div style={{width : etc + "%", backgroundColor : "#f8f9fa"}}>{etc}%</div>}
                </div>
            </div>
            }
            {data.approveBiz == 0 ? "" :
            <div>
                <span className="data-title">승인 기부 사업 {data.approveBiz}건</span> <br/>
                <span className="span-circle" style={{backgroundColor : "#C7CEEA"}}></span><span> 진행 중 ({data.ingBiz}건)</span>
                <span className="span-circle" style={{backgroundColor : "#E2F0CB"}}></span><span> 모금 종료 ({data.donateEndBiz}건)</span>
                <span className="span-circle" style={{backgroundColor : "#D5AAFF"}}></span><span> 사업 종료 ({data.endBiz}건)</span>
                <div className="donate-data">
                    {data.ingBiz == 0 ? "" : <div style={{width : ing + "%", backgroundColor : "#C7CEEA"}}>{ing}%</div>}
                    {data.donateEndBiz == 0 ? "" : <div style={{width : donateEnd + "%", backgroundColor : "#E2F0CB"}}>{donateEnd}%</div>}
                    {data.endBiz == 0 ? "" : <div style={{width : end + "%", backgroundColor : "#D5AAFF"}}>{end}%</div>}
                </div>
            </div>
            }
            {data.donateEndBiz == 0 ? "" :
            <div>
                <span className="data-title">모금 종료 사업 {data.donateEndBiz}건</span> <br/>
                <span className="span-circle" style={{backgroundColor : "#FFDAC1"}}></span><span> 미입금 ({notPay}건)</span>
                <span className="span-circle" style={{backgroundColor : "#AFCBFF"}}></span><span> 입금 완료 ({data.payEndBiz}건)</span>
                <div className="donate-data">
                    {notPay == 0 ? "" : <div style={{width : payNotEnd + "%", backgroundColor : "#FFDAC1"}}>{payNotEnd}%</div>}
                    {data.payEndBiz == 0 ? "" : <div style={{width : payEnd + "%", backgroundColor : "#AFCBFF"}}>{payEnd}%</div>}
                </div>
            </div>
            }
            {data.donateCodeCnt == null ? "" :
            <div>
                <span className="data-title">기부 카테고리 비율</span> <br/>
                {data.donateCodeCnt.map(function(code, index){
                    const bgColor = colors[index % colors.length];

                    return  <span key={"code"+index}>
                                <span className="span-circle" style={{backgroundColor : bgColor}}></span><span > {code.donateCtg} {code.codeCount}개</span>
                            </span>
                })}
                <div className="donate-data">
                    {data.donateCodeCnt.map(function(code, index){
                        const codePct = Math.round(code.codeCount / data.approveBiz * 100 * 10) / 10;
                        const bgColor = colors[index % colors.length];
                        
                        return  <div key={"code"+index} style={{width : codePct + "%", backgroundColor : bgColor}}>{codePct}%</div>
                    })}
                </div>
            </div>
            }
            {goal == 0 ? "" :
            <div>
                <span className="data-title">모금 종료 사업 평균 모금 진행률</span> <br/>
                <span>전체 목표 금액 : {goal == 0 ? 0 : goal.toLocaleString("ko-KR")} 원 /</span><span> 전체 모금액 : {money == 0 ? 0 : money.toLocaleString("ko-KR")} 원</span>
                <div className="donate-data">
                    <div style={{width : avgMoney + "%", backgroundColor : "darkblue", color : "white"}}>{avgMoney}%</div>
                    <div style={{width : (100-avgMoney) + "%"}}></div>
                </div>
            </div>
            }
        </section>
    )
}