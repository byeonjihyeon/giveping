
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
                    setNewsList(res.data.resData);
                });
            }, []);

    const [bizList, setBizList] = useState([]);            
    //추천기부사업 조회 
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/recommand/biz/' + loginMember.memberNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setBizList(res.data.resData);
        })

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
                            <span>{member.totalDonateMoney ? member.totalDonateMoney : 0}</span>
                            <span> 원</span>
                        </div>
                        <div className="donation-cnt">
                            <div>기부횟수</div>
                            <div><Link to='/member/donateList'>{!member.donationHistory ? "" :member.donationHistory.length} 회</Link></div>
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
                            }}>출금신청</button>

                            <Modal modalType={modalType} isOpen={modalType !== null} onClose={function(){
                                setModalType(null);
                            }}>
                                
                                {modalType === 'charge' ?   //충전 페이지
                                <ChargeFrm member={member} setMember={setMember} onClose={setModalType} />
                                :
                                modalType === 'refund' ?    //출금 페이지
                                <RefundFrm member={member} setMember={setMember} onClose={setModalType} />
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
                    <span>|</span>
                    <span>읽지 않은 <span>{unreadAlarmCount}</span>  건</span>
                </div>
                <div className="myNews-item">
                    <div className="m-newsList-wrap" >
                             {
                                newsList.length === 0 ? (
                                <div className="m-news-info">새로운 소식이 없습니다.</div>
                                ) : 
                                (  
                                newsList
                                        .slice(0, 3)
                                        .map(function(news, index) {
                                    return <News key={"news" + index} news={news} />;
                                    })
                                )
                            }
                    </div>
                </div>
            </div>
            <div className="m-mySurvey-wrap">
                <div className="mySurvey-title-wrap">
                    <span>기부가 마무리되었어요 ! 참여한 단체에 만족하셨나요 ?</span>
                </div>
                <div className="mySurvey-item">
                    <div className="mySurvey-wrap">
                            {
                                newsList.filter(survey => 
                                survey.alarmType === 0 &&
                                !(survey.surveyList?.some(item => item.bizNo === survey.bizNo))
                                ).length === 0 ? (
                                <div onClick={function(){
                                    navigate('/biz/list')
                                }}>기부한 활동이 없습니다. 이곳에서 다양한 활동을 탐색해보세요!</div>
                                ) : (
                                newsList.map(function(survey, index) {
                                    return <Surveys key={"survey" + index} survey={survey} />;
                                })
                                )
                            }
                    </div>
                </div>
            </div>
            <div className="interested-biz-wrap">
                <div className="title">
                    {member.memberName} 님, &nbsp;관심 가질만한 기부사업이 도착했어요 ! ☺️
                </div>
                <div className="recommand-biz-wrap">
                    {bizList.map(function(biz, index){
                        return <Biz key={"biz" + index} biz={biz} />
                    })}
                </div>
            </div>
        </div>
    )
}

function Biz(props){
    const biz = props.biz;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const navigate = useNavigate();

    return (
        <div className="recommand-biz" onClick={function(){
            navigate('/biz/view/'+biz.bizNo)
        }}>
            <div className="thumb">
                <img  src={
                            biz.bizThumbPath    //기존 썸네일 가지고있다면?
                            ?
                            serverUrl + "/biz/thumb/" + biz.bizThumbPath.substring(0,8) + "/" + biz.bizThumbPath
                            :
                            "/images/default_img.png"     
                        } />
                <div className="biz-ctg">{biz.donateCtg}</div>        
            </div>
            <div className="info">
                <div>{biz.bizName}</div> 
                <div>{biz.orgName}</div>       
            </div>
        </div>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
     const {loginMember, fetchUnreadAlarmCount} = useUserStore();


    if (
        news.alarmType === 3 ||
        news.alarmType === 4
    ) {
        return null;
    }

    
    let content;
    if(news.alarmType === 0){
        content = `[사업종료] ${news.orgName} 의 "${news.bizName}" 사업이 종료되었습니다. 설문조사를 해주세요.`;
    }else if(news.alarmType === 1){
        content = `[첨부파일업로드] ${news.orgName} 의 "${news.bizName}" 사업이 업데이트 되었습니다.`;
    }else if(news.alarmType === 2){
        content = `[관심단체] ${news.orgName} 의 새로운 소식이 업데이트 되었습니다.`;
    }else if(news.alarmType === 5){
        content = `[환불완료] 환불액 입금 처리가 완료되었습니다.`;
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
            Swal.fire({
                        title : '알림',
                        text : '이미 설문조사에 참여했습니다.',
                        icon : 'warning'
                });
            } else {    // 설문조사한 이력 없는 경우 -> 설문조사창으로 이동
            navigate('/biz/view/' + news.bizNo + '?survey=open');
            }
        }else if(news.alarmType === 1){
            navigate('/biz/view/' + news.bizNo);
        }else if(news.alarmType === 2){
            navigate('/news/view/' + news.newsNo);
        }else if(news.alarmType === 5){
        content = `[환불완료] 환불액 입금 처리가 완료되었습니다.`;
        }
    }

    // 알림 읽음 처리 함수
    function markAsRead(alarmNo){
        let options={};
        options.url= serverUrl + '/member/alarm/' + alarmNo;
        options.method = "patch";

        axiosInstance(options)
        .then(function(res){
            
            // 안 읽은 알림 갯수 reload
            let options = {};
            options.url = serverUrl + '/countAlarm';
            // options.params 설정 : orgNo 인지 memberNo 인지에 따라 달라짐
            options.params = { memberNo: loginMember.memberNo };
            options.method = 'get';
    
            axiosInstance(options)
            .then(function(res){

            // DotBadge 업데이트를 위해 useUserStore의 함수 호출
            fetchUnreadAlarmCount();
            });
        });
    }

    return (
        <div 
            className="m-news-info" 
            onClick={handleClick} 
            style={{
                cursor: 'pointer',
                color: news.alarmRead === 1 ? 'gray' : '#333333',
                border: news.alarmRead === 1 ? '1px solid #f0f0f0' : '1px solid lightblue',
            }}
        >
            <div>{content}</div>
            <div>
                <span>{news.bizName} </span>
                <span>{news.alarmDate}</span>
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
            Swal.fire({
                        title : '알림',
                        text : '이미 설문조사에 참여했습니다.',
                        icon : 'warning'
                });
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
                <div className="biz-end">사업종료</div>
            </div> 
            <div className="posting-info">
                <div className="posting-title">{survey.bizName}</div>
                <div className="posting-sub-info">{survey.orgName} </div> 
                 <div className="move-survey">
                    <Link to='#'>설문조사 참여하기 &gt;</Link>
                </div>
            </div>
           
    </div>
    );
}

