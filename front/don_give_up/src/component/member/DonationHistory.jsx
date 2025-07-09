import { useEffect, useState } from "react"
import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';
import DateSelectBar from '../common/DateSelectBar';
import { format, startOfMonth, subYears } from "date-fns";


//기부내역 조회 리스트
export default function DonationHistory(props){
    const member = props.member;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginMember} = useUserStore();
    
    const [donationHistory, setDonationHistory] = useState([]);
    const [pageinfo, setPageInfo] = useState({}); 
    const [reqPage, setReqPage] = useState(1);
    const [startDate, setStartDate] = useState(format(startOfMonth(subYears(new Date(), 1)),'yyyy-MM-dd HH:mm:ss')); //초기값 작년 오늘날짜 해당월의 1일로 설정, 
    const [endDate, setEndDate] = useState(format(new Date(),'yyyy-MM-dd HH:mm:ss')); //오늘날짜로 초기값
    const [srchCnt, setSrchCnt] = useState(0);    //해당기간 기부건수

    //해당기간 회원 기부내역 조회
    useEffect(function(){
        
         let options = {};
         options.url = serverUrl + '/member/donationHistory/' + loginMember.memberNo;
         options.params = {
            reqPage, startDate, endDate               
         }
         options.method = 'get';

         axiosInstance(options)
         .then(function(res){
            let results = res.data.resData; 
            setDonationHistory(results.donationHistory);
            setPageInfo(results.pageInfo);
            setSrchCnt(results.totalCnt);

         })
    }, [reqPage, startDate, endDate])

    return (
        <div className="member-donate-list-wrap-out">
            <div>기부내역</div>
            <div>
                <div>총 기부건수</div>
                <div>{!member.donationHistory ? "" : member.donationHistory.length} 건</div>
                <div>총 기부금액</div>
                <div>{member.totalDonateMoney} 원</div>
            </div>
            
            <div className="member-donate-period">
                <DateSelectBar startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                <div>(조회결과 : {srchCnt} 건)</div>
            </div>
            {
            !donationHistory ?
            ""
            :
            donationHistory.length > 0 ?
                <div className="donate-list-wrap-in">
                {donationHistory.map(function(donation,index){
                    return <Donation key={"donation" + index} donation={donation} />
                })}              
                </div>
            
            :
             <>
                <div>조회되는 기부내역이 없네요..</div>
             </>
            }
            {
            reqPage < pageinfo.totalPage ?
            <div onClick={function(){
                    setReqPage(reqPage + 1); 
            }}>더보기</div>
            :
            ""
            }
            <div>조회 기간은 최근 1년 기준으로 설정되어 있습니다. <br/> 
                 다른 조건으로 검색을 원하실 경우 검색 기간 설정을 변경해주세요.</div>
         
        </div>
    )
}

function Donation(props){

    const donation = props.donation;

    return (
       <>
        <div className="donate-info-wrap">
                <div className="state-wrap">
                    <div className="state">
                        <span>기부완료</span>
                    </div>
                </div>
                <div className="donate-info">
                    <div>{donation.donateDate}</div>
                    <div>{donation.bizName}</div>
                    <div>{donation.orgName}</div>
                </div>
                <div className="donate-money">
                    <span>{donation.donateMoney} 원</span>
                    <button type="button">영수증 출력</button>
                </div>
        </div> 
       </> 
    )
}

