import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//기부 사업 통계
export default function OrgData(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const {loginOrg} = useUserStore();

    //조회한 데이터 저장할 변수
    const [data, setData] = useState({});

    const [money, setMoney] = useState(0);          //모금액 전체
    const [goal, setGoal] = useState(0);            //목표금액 전체
    const [avgMoney, setAvgMoney] = useState(0);    //평균 진행률

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/data/" + loginOrg.orgNo;
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
            <div className="page-title">기부 사업 통계</div>
            {data.allBiz == 0 ? "" :
            <div>
                <span>전체 기부 사업 {data.allBiz}건</span>
                <div style={{width : "800px", display : "flex", border : "1px solid black"}}>
                    {data.notApproveBiz == 0 ? "" : <div style={{width : notApprove + "%", backgroundColor : "red"}}>미승인 {data.notApproveBiz}건<br/>({notApprove}%)</div>}
                    {data.rejectBiz == 0 ? "" : <div style={{width : reject + "%", backgroundColor : "blue"}}>반려 {data.rejectBiz}건<br/>({reject}%)</div>}
                    {data.approveBiz == 0 ? "" : <div style={{width : approve + "%", backgroundColor : "green"}}>승인 {data.approveBiz}건<br/>({approve}%)</div>}
                    {rest == 0 ? "" : <div style={{width : etc + "%", backgroundColor : "gray"}}>기타 {rest}건<br/>({etc}%)</div>}
                </div>
            </div>
            }
            {data.approveBiz == 0 ? "" :
            <div>
                <span>승인 기부 사업 {data.approveBiz}건</span>
                <div style={{width : "800px", display : "flex", border : "1px solid black"}}>
                    {data.ingBiz == 0 ? "" : <div style={{width : ing + "%", backgroundColor : "orange"}}>진행 중 {data.ingBiz}건<br/>({ing}%)</div>}
                    {data.donateEndBiz == 0 ? "" : <div style={{width : donateEnd + "%", backgroundColor : "purple"}}>모금 종료 {data.donateEndBiz}건<br/>({donateEnd}%)</div>}
                    {data.endBiz == 0 ? "" : <div style={{width : end + "%", backgroundColor : "pink"}}>사업 종료 {data.endBiz}건<br/>({end}%)</div>}
                </div>
            </div>
            }
            {data.donateEndBiz == 0 ? "" :
            <div>
                <span>모금 종료 사업 {data.donateEndBiz}건</span>
                <div style={{width : "800px", display : "flex", border : "1px solid black"}}>
                    {notPay == 0 ? "" : <div style={{width : payNotEnd + "%", backgroundColor : "yellow"}}>미입금 {notPay}건<br/>({payNotEnd}%)</div>}
                    {data.payEndBiz == 0 ? "" : <div style={{width : payEnd + "%", backgroundColor : "skyblue"}}>입금 완료 {data.payEndBiz}건<br/>({payEnd}%)</div>}
                </div>
            </div>
            }
            {data.donateCodeCnt == null ? "" :
            <div>
                <span>기부 카테고리 비율</span>
                <div style={{width : "800px", display : "flex", border : "1px solid black"}}>
                    {data.donateCodeCnt.map(function(code, index){
                        const codePct = Math.round(code.codeCount / data.approveBiz * 100 * 10) / 10;
                        const bgColor = colors[index % colors.length];
                        
                        return  <div key={"code"+index} style={{width : codePct + "%", backgroundColor : bgColor}}>{code.donateCtg} {code.codeCount}개<br/>({codePct}%)</div>
                    })}
                </div>
            </div>
            }
            {goal == 0 ? "" :
            <div>
                <span>모금 종료 사업 평균 모금 진행률</span>
                <div style={{width : "800px", display : "flex", border : "1px solid black"}}>
                    <div style={{width : avgMoney + "%", backgroundColor : "darkblue", color : "white"}}>{avgMoney}%</div>
                </div>
            </div>
            }
        </section>
    )
}