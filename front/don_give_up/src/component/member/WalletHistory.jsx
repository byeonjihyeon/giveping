import { useEffect, useState } from "react"
import DateSelectBar from '../common/DateSelectBar';
import { format, startOfMonth, subYears } from "date-fns";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//충전, 출금내역 페이지
export default function ChargeNrefund(props){

    const member= props.member;
     //스토리지에서 회원번호 추출용도
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    

    const [walletHistory, setWalletHistory] = useState([]); //회원 충전,출금내역
    const [filter, setFilter] = useState("all");               //구분값 (충전, 출금)
    const [pageInfo, setPageInfo] = useState({});           //페이지네이션
    const [reqPage, setReqPage] = useState(1);              //요청페이지
    const [startDate, setStartDate] = useState(format(startOfMonth(subYears(new Date(), 1)),'yyyy-MM-dd HH:mm:ss')); //초기값 작년 오늘날짜 해당월의 1일로 설정, 
    const [endDate, setEndDate] = useState(format(new Date(),'yyyy-MM-dd HH:mm:ss')); //오늘날짜로 초기값
    //select 태그 onChange함수
    function chgFilter(e){
        setFilter(e.target.id);
        setReqPage(1);
    }

    //회왼 충전, 출금 내역 서버에 요청 
    useEffect(function(){
        let options ={};
        options.url = serverUrl + "/member/walletHistory/" + loginMember.memberNo;
        options.method = 'get';
        options.params = {filter, reqPage, startDate, endDate};

        axiosInstance(options)
        .then(function(res){
            //res.data.resData == walletMap
            setWalletHistory(res.data.resData.walletHistory);
            setPageInfo(res.data.resData.pageInfo);
            console.log(res.data.resData.walletHistory);
        })
    },[reqPage, startDate, endDate, filter]);

    return (
        <div className='wallet-wrap'>
            <div className="wallet-list-title">충전 / 출금내역</div>
            <div className="wallet-content">
                조회 기간은 최근 1년 기준으로 설정되어 있습니다. <br/> 
                다른 조건으로 검색을 원하실 경우 검색 기간 설정을 변경해주세요.
            </div>
            <div className='wallet-money'>보유 금액 <span>{member.totalMoney} 원</span></div>
            <div>
                <div className='filter-wrap'>
                    <div className='filter-period'>
                        <DateSelectBar setStartDate={setStartDate} setEndDate={setEndDate}/>
                    </div>
                    <div className="filter-detail">
                        <div id='all' onClick={chgFilter}>전체</div>
                        <div id='charge' onClick={chgFilter}>충전</div>
                        <div id='refund' onClick={chgFilter}>출금</div>
                    </div>
                </div>
                {walletHistory.length != 0?
                <div className='wallet'>
                    {walletHistory.map(function(wallet, index){
                        return <Wallet key={"wallet" + index} wallet={wallet} />
                    })}
                </div>
                :
                <div className="wallet">
                    <div className="no-data">검색결과가 없습니다.</div>
                </div>
                }
            </div>
            {pageInfo.totalPage > 1 && reqPage < pageInfo.totalPage?
            <div className='more-info' onClick={function(e){
                if(reqPage < pageInfo.totalPage){
                    setReqPage(reqPage+1);
                }
            }}>
                더보기
            </div>
            :
            ""
            }
        </div>       
    )
}

function Wallet(props){
    const wallet = props.wallet;

    return (
        <div className="history-wrap">
            <div className='wallet-icons'>
                <div className={wallet.type == 'charge' ? "out-circle" : wallet.type == 'refund' && wallet.refundFinDate != null ? "out-circle refund" : "out-circle refund-before" }>
                    <div className={wallet.type == 'charge' ? "in-circle" : wallet.type == 'refund' && wallet.refundFinDate != null ? "in-circle in-refund" : "in-circle in-refund-before" }>￦</div>
                </div>
            </div>
            <div className="wallet-info">
                <div>{wallet.transDate}</div>  
                <div className='wallet-status'>{
                    wallet.type == 'charge' ? "충전완료"
                    : 
                    wallet.type == 'refund' && wallet.refundFinDate != null ? "출금완료"
                    :
                    "출금처리중"
                }</div>
                <div>{wallet.type == 'refund' ?
                        <span>{wallet.memberAccountBank} | {wallet.memberAccount}</span> 
                    :
                    ""
                }</div>
            </div>     
            <div className="wallet-result">
                <div><span>{wallet.money}</span> 원</div>
            </div>   
        </div>
    )
}