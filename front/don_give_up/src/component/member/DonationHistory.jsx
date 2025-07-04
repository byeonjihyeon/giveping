import { useEffect, useState } from "react"
import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';

//기부내역 조회 리스트
export default function DonationHistory(props){
    const member = props.member;

    /* 
    화면에 보여줄 내용
    1. 후원한 사업 개수
    2. 총 기부금액
    3. 후원한 단체
    4. 후원한 사업 이름
    3. 기부 날짜
    4. 기부 금액
    5. 기부 없을시 내용 출력
    6. 영수증 버튼 출력

    가능하다면, 전체내역과  상단에 기부내역, 결제내역 버튼 누르면 각각 해당 내용 나올수 있도록
    */

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginMember} = useUserStore();
    
    const [donationHistory, setDonationHistory] = useState([]);
    const [pageinfo, setPageInfo] = useState({}); 
    const [reqPage, setReqPage] = useState(1);

    useEffect(function(){
         let options = {};
         options.url = serverUrl + '/member/donationHistory/' + loginMember.memberNo +"/"+ reqPage;
         options.method = 'get';

         axiosInstance(options)
         .then(function(res){
            let results = res.data.resData;
            setDonationHistory(results.donationHistory);
            setPageInfo(results.pageInfo);
         })
    }, [reqPage])

    return (
        <div className="member-donate-list-wrap-out">
            <div>기부내역</div>
            
            <div className="member-donate-period">
                <p>기간설정 영역</p>
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

