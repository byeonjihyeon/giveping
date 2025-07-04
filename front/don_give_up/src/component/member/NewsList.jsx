import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";


//마이페이지 소식페이지
export default function NewsList(){
    const {loginMember} = useUserStore();
    // loginMember가 null일 때 대비
    if (!loginMember) {
        return <div>로그인 정보가 없습니다.</div>;
    }

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const memberNo = loginMember.memberNo;
   
    
    /*
    const [newsList, setNewsList] = useState([
        {title: '제목1', content: '내용1', date: '2025-06-30', sender: '운영자'},
        {title: '제목2', content: '내용2', date: '2025-06-30', sender: '운영자'},
        {title: '제목3', content: '내용3', date: '2025-06-30', sender: '운영자'},
        {title: '제목4', content: '내용4', date: '2025-06-30', sender: '운영자'},
        {title: '제목5', content: '내용5', date: '2025-06-30', sender: '운영자'}
    ]);
    */
    const [newsList, setNewsList] = useState([]);
    const [isNewsRead, setIsNewsRead] = useState(false); // 소식 읽었는지 여부 (초기값 : false / 읽을 경우 true로 변경)



    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/alarm/' + memberNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNewsList(res.data.resData);
        });
    }, []);


    

    return (
        <div className="newsList-wrap" >
                {newsList.map(function(news, index){
                     return <News key={"news" + index} news={news} />   
                })}
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
    if(news.alarmType === 0){
        content = `[사업종료] ${news.orgName} 의 "${news.bizName}" 사업이 종료되었습니다. 설문조사를 해주세요.`;
    }else if(news.alarmType === 1){
        content = `[첨부파일업로드] ${news.orgName} 의 "${news.bizName}" 사업이 업데이트 되었습니다.`;
    }else if(news.alarmType === 2){
        content = `[관심단체] ${news.orgName} 의 새로운 소식이 업데이트 되었습니다.`;
    }

    // 알림 아이템 클릭 시 호출되는 핸들러 함수
    function handleClick() {
        markAsRead(news.alarmNo);
        // news.alarmType 이 1일 경우
        //navigate('/news/view/' + news.bizNo);
        //navigate('/biz/view/' + news.bizNo);

        if(news.alarmType === 0){
            console.log("타입 0번 클릭");
            navigate('/biz/view/'+news.bizNo+'?survey=open');
        }else if(news.alarmType === 1){
            navigate('/biz/view/' + news.bizNo);
        }else if(news.alarmType === 2){
            navigate('/news/view/' + news.newsNo);
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