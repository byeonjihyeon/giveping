import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
//내 소식(단체)
export default function OrgNewsList(){
    const { loginOrg, unreadAlarmCount, setUnreadAlarmCount, setHasNewAlert} = useUserStore();
    // loginMember가 null일 때 대비
    if (!loginOrg) {
        return <div>로그인 정보가 없습니다.</div>;
    }

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const orgNo = loginOrg.orgNo;

    
    useEffect(function(){
            let options = {};
            options.url = serverUrl + '/org/alarm/' + orgNo;
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                console.log(res.data.resData);
                const alarms = res.data.resData;
                setNewsList(alarms);
                /*
                // 전체 다 읽음 처리
                markAllAsRead(alarms.map(function(a) {
                    return a.alarmNo;
                }))
                */
            });
        }, []);
        

    const [newsList, setNewsList] = useState([]);
    //const [isNewsRead, setIsNewsRead] = useState(false); // 소식 읽었는지 여부 (초기값 : false / 읽을 경우 true로 변경)

    return (
        <>
        <h2 className="page-title" style={{marginBottom : "20px", textAlign : "left", marginLeft : "20px"}}>내 소식</h2>
        <div className="newsList-wrap" >
        {
            Array.isArray(newsList) && newsList.length>0
            ?
            newsList.map(function(news, index){
                    return <News key={"news" + index} news={news}  setHasNewAlert={setHasNewAlert} setUnreadAlarmCount={setUnreadAlarmCount} loginOrg={loginOrg}/>   
            })
            :
                <p>새로운 소식이 없습니다.</p>
        }
        </div>
        </>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();
    const setHasNewAlert = props.setHasNewAlert;
    const setUnreadAlarmCount = props.setUnreadAlarmCount;
    const loginOrg = props.loginOrg;
    
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 날짜 계산
    const now = new Date();
    const alarmDate = new Date(news.alarmDate);

    // 두 날짜 차이 계산 (밀리초 단위)
    const diffTime = now.getTime() - alarmDate.getTime();

    // 하루는 86400000 밀리초
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // alarmType 1,2,5인 경우 랜더링x
    if (news.alarmType == 1 || news.alarmType == 2 || news.alarmType == 5) {
     return null;
    }

    // 만약 2일 이상 지난 알림이면 렌더링하지 않음
    if (diffDays >= 2) {
        return null;
    }

    /*
    // alarmRead가 0이 아닌 경우 렌더링하지 않음
    if (news.alarmRead !== 0) {
        return null;
    }
    */
    
    let content;
    if(news.alarmType === 3){
        content = `[입금완료] ${news.bizName} 기부사업의 모금액 입금이 완료되었습니다.`;
    }else if(news.alarmType === 4){
        content = `[사업종료] ${news.bizName} 기부사업이 종료되었습니다.`;
    }
    
    // 알림 아이템 클릭 시 호출되는 핸들러 함수
    function handleClick() {
        markAsRead(news.alarmNo);
        if(news.alarmType === 3){
            navigate('/biz/view/' + news.bizNo);
        }else if(news.alarmType === 4){
            navigate('/biz/view/' + news.bizNo);
        }
    }

    
        // 알림 읽음 처리 함수
    function markAsRead(alarmNo){
        //console.log("alarmNo" , alarmNo)
        let options={};
        options.url= serverUrl + '/org/alarm/' + alarmNo;
        options.method = "patch";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            // 안 읽은 알림 갯수 reload
            let options = {};
            options.url = serverUrl + '/countAlarm';
            // options.params 설정 : orgNo 인지 memberNo 인지에 따라 달라짐
            options.params = { orgNo: loginOrg.orgNo };
            options.method = 'get';
    
            axiosInstance(options)
            .then(function(res){
                console.log(res.data.resData);

                const count = res.data.resData;
                if(count > 0){
                    console.log("안읽은알림갯수 : ", count);
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
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                color: news.alarmRead === 1 ? 'gray' : 'black',
                backgroundColor: news.alarmRead === 1 ? '#f0f0f0' : 'white',
            }}
        >
         
            <div>{content}</div>
            <div>
                <span>{news.alarmDate}</span>
            </div>
        </div>
    );

}