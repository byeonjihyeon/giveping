import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Modal from "../common/Modal";

export default function MyHome(props){
    const member = props.member;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginMember, orgNo, unreadAlarmCount} = useUserStore();
    const [newsList, setNewsList] = useState([]);
    const [reLoadMember, setReLoadMember] = useState({}); 
	//모달창 상태
    const [modalType, setModalType] = useState(null); //'charge' or 'refund' or 'null'

    // 알림 리스트 가져오기
    useEffect(function(){
                let options = {};
                options.url = serverUrl + '/member/alarm/' + loginMember.memberNo;
                options.method = 'get';
    
                axiosInstance(options)
                .then(function(res){
                    console.log(res.data.resData);
                    setNewsList(res.data.resData);
                });
            }, []);

    useEffect(() => {
        //fetchAlarmList();
        fetchMemberInfo(); 
    }, []);
    
    // 알림 안 읽은 갯수 업데이트를 위해 회원 정보 다시 가져오기
    function fetchMemberInfo(){
        let options = {};
        options.url = serverUrl + '/member/' + loginMember.memberNo;
        options.method = 'get';
        
        axiosInstance(options)
        .then(function(res){
            setReLoadMember(res.data.resData);
            console.log(res.data.resData);
            //console.log(setReLoadMember.unreadAlarm);
        })
    }


    return (
        <div className="myHome-wrap">
            <div className="myHome-wrap-top">
                <div className="top-info">
                    <div className="detail-left">
                        <div>총 기부금</div>
                    </div>    
                    <div className='detail-right'>
                        <div className="money">
                            <span>{member.totalDonateMoney}</span>
                            <span> 원</span>
                        </div>
                        <div className="donation-cnt">
                            <div>기부횟수</div>
                            <div>{!member.donationHistory ? "" :member.donationHistory.length} 회</div>
                        </div>
                    </div>
                </div>
                <div className="top-info">
                    <div className="detail-left">
                        <div>나의 보유금액</div>
                    </div>    
                    <div className='detail-right'>
                        <div className="money">
                            <span>{member.totalMoney}</span> 
                            <span> 원</span>
                        </div>
                        <div className="chargeOrRefund-btn">
                            <button className="charge-btn" onClick={function(){
                                setModalType('charge');                        
                            }} >충전</button>
                            <button className="refund-btn" onClick={function(){
                                setModalType('refund');
                            }}>출금</button>
                            <Modal title={"충전하기"} isOpen={modalType !== null} onClose={function(){
                                setModalType(null);
                            }}>

                            {modalType === 'charge' ?
                            <ChargeFrm onClose={setModalType}  />
                            :
                            modalType === 'refund' ?
                            <RefundFrm />
                            :
                            ""
                            }
                            </Modal>                     
                        </div>                       
                    </div>
                </div>
            </div>
            <div className="myNews-wrap">
                <div className="myNews-title-wrap">
                    <span>내 소식</span>
                    <span> | 총 {unreadAlarmCount} 건</span>
                </div>
                <div className="myNews-item">
                    <div className="newsList-wrap" >
                             {
                                newsList.filter(news => news.alarmRead === 0).length === 0 ? (
                                <div>새로운 소식이 없습니다.</div>
                                ) : (
                                newsList
                                    .filter(news => news.alarmRead === 0)
                                    .slice(0, 3)
                                    .map(function(news, index) {
                                    return <News key={"news" + index} news={news} />;
                                    })
                                )
                            }
                    </div>
                </div>
            </div>
            <div className="myNews-wrap">
                <div className="myNews-title-wrap">
                    <span>설문조사</span>
                </div>
                <div className="myNews-item">
                    <div className="mynewsList-wrap">
                            {
                                newsList.filter(survey => 
                                survey.alarmType === 0 &&
                                !(survey.surveyList?.some(item => item.bizNo === survey.bizNo))
                                ).length === 0 ? (
                                <div>설문조사가 없습니다.</div>
                                ) : (
                                newsList.map(function(survey, index) {
                                    return <Surveys key={"survey" + index} survey={survey} />;
                                })
                                )
                            }
                    </div>
                </div>
            </div>
        </div>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();
    console.log(news);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();


    
    let content;
    if(news.alarmType === 0){
        content = `[사업종료] ${news.orgName} 의 "${news.bizName}" 사업이 종료되었습니다. 설문조사를 해주세요.`;
    }else if(news.alarmType === 1){
        content = `[첨부파일업로드] ${news.orgName} 의 "${news.bizName}" 사업이 업데이트 되었습니다.`;
    }else if(news.alarmType === 2){
        content = `[관심단체] ${news.orgName} 의 새로운 소식이 업데이트 되었습니다.`;
    }else if(news.alarmType === 3){
        content = `[입금완료] ${news.bizNo} 의 모금액 입금이 완료되었습니다.`;
    }else if(news.alarmType === 5){
        content = `[환불완료] 환불액 입금 처리가 완료되었습니다.`;
    }

    
    // alarmRead가 0이 아닌 경우 렌더링하지 않음
    if (news.alarmRead !== 0) {
        return null;
    }
    

    // 알림 아이템 클릭 시 호출되는 핸들러 함수
    function handleClick() {
        markAsRead(news.alarmNo);
        if(news.alarmType === 0){
            var hasSurveyForBiz = false; // surveyList 중 bizNo가 news.bizNo와 같은 게 하나라도 있는지 검사하는 변수

            for (var i = 0; i < news.surveyList.length; i++) {
                if (news.surveyList[i].bizNo === news.bizNo) {
                    hasSurveyForBiz = true; // 설문조사한 이력 있을 경우 hasSurveyForBiz가  true 값으로 변경됨
                    break;
                }
            }
            if (hasSurveyForBiz) {  // 설문조사한 이력 있는 경우 -> alert 창
            alert('이미 설문조사에 참여했습니다.'); 
            } else {    // 설문조사한 이력 없는 경우 -> 설문조사창으로 이동
            navigate('/biz/view/' + news.bizNo + '?survey=open');
            }
        }else if(news.alarmType === 1){
            navigate('/biz/view/' + news.bizNo);
        }else if(news.alarmType === 2){
            navigate('/news/view/' + news.newsNo);
        }else if(news.alarmType === 3){
            console.log("type 3 클릭")
        }else if(news.alarmType === 5){
        content = `[환불완료] 환불액 입금 처리가 완료되었습니다.`;
    }
    }

    // 알림 읽음 처리 함수
    function markAsRead(alarmNo){
        //console.log("alarmNo" , alarmNo)
        let options={};
        options.url= serverUrl + '/member/alarm/' + alarmNo;
        options.method = "patch";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
        });
    }

    

    return (
        <div 
            className="news-info" 
            onClick={handleClick} 
            style={{
                cursor: 'pointer',
                color: news.alarmRead === 1 ? 'gray' : 'black',
                backgroundColor: news.alarmRead === 1 ? '#f0f0f0' : 'white',
            }}
        >
            <div>{content}</div>
            <div>
                <span>{news.bizName}</span> | <span>{news.alarmDate}</span>
            </div>
        </div>
    );
}

function Surveys(props){
    const survey = props.survey;
    const navigate = useNavigate();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    // alarmType이 0이 아닌 경우 렌더링하지 않음
    if (survey.alarmType !== 0) {
        return null;
    }

    // 설문조사 이력이 있는 경우 렌더링하지 않음
    const hasSurveyForBiz = survey.surveyList?.some(item => item.bizNo === survey.bizNo);
    if (hasSurveyForBiz) {
        return null;
    }

    function handleClick() {
        var hasSurveyForBiz = false; // surveyList 중 bizNo가 news.bizNo와 같은 게 하나라도 있는지 검사하는 변수

            for (var i = 0; i < survey.surveyList.length; i++) {
                if (survey.surveyList[i].bizNo === survey.bizNo) {
                    hasSurveyForBiz = true; // 설문조사한 이력 있을 경우 hasSurveyForBiz가  true 값으로 변경됨
                    break;
                }
            }
            if (hasSurveyForBiz) {  // 설문조사한 이력 있는 경우 -> alert 창 경고
            alert('이미 설문조사에 참여했습니다.'); 
            } else {    // 설문조사한 이력 없는 경우 -> 설문조사창으로 이동
            navigate('/biz/view/' + survey.bizNo + '?survey=open');
            }
    }


    return (
        <div className="survey-card" onClick={handleClick}>
            <div className="posting-img">
                <img
                    src={survey.bizThumb
                        ? serverUrl + "/biz/thumb/" + survey.bizThumb.substring(0, 8) + "/" + survey.bizThumb
                        : "/images/default_img.png"}
                />
            </div> 
            <div className="posting-title">{survey.bizName}</div>
            <div className="posting-sub-info">
                <span>{survey.orgName}</span>
            </div>
    </div>
    );
}

