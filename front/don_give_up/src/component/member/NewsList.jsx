import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";


//마이페이지 소식페이지
export default function NewsList(){
    const {loginMember, setUnreadAlarmCount, setHasNewAlert} = useUserStore();
    // loginMember가 null일 때 대비
    if (!loginMember) {
        return <div>로그인 정보가 없습니다.</div>;
    }

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const memberNo = loginMember.memberNo;

    useEffect(function(){
            let options = {};
            options.url = serverUrl + '/member/alarm/' + memberNo;
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                
                const alarms = res.data.resData;
                setNewsList(alarms);
            });
        }, []);

   

    const [newsList, setNewsList] = useState([]);
    //const [isNewsRead, setIsNewsRead] = useState(false); // 소식 읽었는지 여부 (초기값 : false / 읽을 경우 true로 변경)

    return (
        <div className='news-wrap'>
            <div className="mynews-title">
                <span>내 소식</span>
            </div>
            <div className="myNews-mid">
                <span>- 2일 지난 알림은 자동 삭제처리 됩니다.</span>
                <span>- 알림 클릭시, 읽음 처리됩니다.</span>
            </div>
                {
                    Array.isArray(newsList) && newsList.length > 0
                    ?
                    newsList.map(function(news, index){
                                
                        return  <div key={"news" + index} className="mynews-list">
                                    <div  className="newsList-wrap" >
                                        <News news={news} setHasNewAlert={setHasNewAlert} setUnreadAlarmCount={setUnreadAlarmCount} loginMember={loginMember}/>   
                                    </div>
                                </div>   
                    })
                    :
                    <div className="no-news-wrap">
                        <p>새로운 소식이 없습니다.</p>
                    </div>
                }
        </div>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();
    
    const setHasNewAlert = props.setHasNewAlert;
    const setUnreadAlarmCount = props.setUnreadAlarmCount;
    const loginMember = props.loginMember;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 날짜 계산
    const now = new Date();
    const alarmDate = new Date(news.alarmDate);

    // 두 날짜 차이 계산 (밀리초 단위)
    const diffTime = now.getTime() - alarmDate.getTime();

    // 하루는 86400000 밀리초
    const diffDays = diffTime / (1000 * 60 * 60 * 24);


    // alarmType 3과 4인 경우 렌더링하지 않음
    if (news.alarmType == 3 || news.alarmType == 4) {
     return null;
    }
    // 2일 이상 지난 알림이면 렌더링하지 않음
    if (diffDays >= 2) {
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

                const count = res.data.resData;
                if(count > 0){
                    setHasNewAlert(true);
                    setUnreadAlarmCount(count);    // 결과 unreadAlarmCount 에 set 하기
                }else{
                    setHasNewAlert(false);
                    setUnreadAlarmCount(count);
                }
            });
        });
    }
        

    

    return (
        <div 
            className="news-info" 
            onClick = {handleClick}
            style={{
                cursor: 'pointer',
                color: news.alarmRead === 1 ? 'gray' : '#333333',
                border: news.alarmRead === 1 ? '1px solid #f0f0f0' : '1px solid lightblue',
            }}
        >
            <div>{content}</div>
            <div>
                <span>{news.bizName}</span> | <span>{news.alarmDate}</span>
            </div>
        </div>
    );
}

