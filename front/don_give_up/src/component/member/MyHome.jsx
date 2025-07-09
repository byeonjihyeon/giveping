
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Modal from "../common/Modal";
import ChargeFrm from "../common/ChargeFrm";
import RefundFrm from "../common/RefundFrm";
import Swal from "sweetalert2";

//마이홈 컴포넌트
export default function MyHome(props){
    const member = props.member;
    const setMember = props.setMember;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const {loginMember, unreadAlarmCount} = useUserStore();
    const [newsList, setNewsList] = useState([]);
	//모달창 상태
    const [modalType, setModalType] = useState(null); //'charge' or 'refund' or 'null'
     const navigate = useNavigate();

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
                            <div className="refund-btn" onClick={function(){
                                if(member.memberBankCode == '0'){
                                    Swal.fire({     //등록된 계좌가 없을경우
                                        title : '알림',
                                        text : '등록된 계좌가 없습니다. 인증 페이지로 이동할까요?',
                                        icon : 'warning',
                                        showCancelButton: true,
                                        confirmButtonText: '이동하기',
                                        cancelButtonText: '취소'
                                    }).then(function(res){
                                        if(res.isConfirmed){
                                            navigate('/member/accountInfo');
                                        }
                                    })
                                    return;
                                }
                                setModalType('refund');
                            }}>출금신청</div>

                            <Modal modalType={modalType} isOpen={modalType !== null} onClose={function(){
                                setModalType(null);
                            }}>
                                {modalType === 'charge' ?
                                <ChargeFrm onClose={setModalType} member={member} setMember={setMember}  />
                                :
                                modalType === 'refund' ?
                                <RefundFrm onClose={setModalType} member={member} setMember={setMember} title='출금신청'/>
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

