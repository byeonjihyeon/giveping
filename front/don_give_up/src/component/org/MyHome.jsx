import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Modal from "../common/Modal";


export default function MyHome(props){
    const {loginMember, loginOrg, unreadAlarmCount, setUnreadAlarmCount, setHasNewAlert} = useUserStore();
    const orgNo = loginOrg.orgNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [newsList, setNewsList] = useState([]);

    useEffect(function(){
            let options = {};
            options.url = serverUrl + '/org/alarm/' + orgNo;
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                console.log(res.data.resData);
                setNewsList(res.data.resData);
            });
        }, []);

    return(

        <div className="myNews-wrap">
                <div className="myNews-title-wrap">
                    <span>내 소식</span>
                    <span> | 총 { unreadAlarmCount }  건</span>
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
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

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
        //console.log("alarmNo" , alarmNo);
        let options={};
        options.url= serverUrl + '/org/alarm/' + alarmNo;
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
                <span>{news.alarmDate}</span>
            </div>
        </div>
    );

}