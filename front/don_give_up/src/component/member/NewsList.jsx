import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";


//마이페이지 소식페이지
export default function NewsList(){
    const {loginMember} = useUserStore();
    const memberNo = loginMember.memberNo;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

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
        options.url = serverUrl + '/member/news/' + memberNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNewsList(res.data.resData);
        });
    }, []);



    return (
        <div className="newsList-wrap" >
                {newsList.map(function(news,index){
                     return <News key={"news" + index} news={news} />   
                })}
        </div>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;

    return (

        
            <div className="news-info">
                {/* 알림 종류(0 : 사업 종료날(설문조사필수), 1 : 보고서 등 사업 상세 페이지에 첨부파일 업로드 시, 2 : 관심 단체의 소식) */}
                {/* [사업종료] 단체명의 기부사업명이 사업 종료되었습니다. 설문조사를 해주세요.*/}
                {/* [첨부파일업로드] 단체명의 어떤 기부사업이 업데이트 되었습니다. 확인해주세요!*/}
                {/* [관심단체] 관심단체명의 새로운 소식이 업데이트 되었습니다.*/}
                {/*alarmType == 0 인 경우*/}
                <div>[사업종료] {news.orgName} 의 "{news.bizName}" 사업이 사업 종료되었습니다.</div> 
                {/*alarmType == 1 인 경우*/}
                <div>[첨부파일업로드] {news.orgName} 의 "{news.bizName}"" 사업이 업데이트 되었습니다. </div>
                {/*alarmType == 2 인 경우*/}
                <div>[관심단체] {news.orgName} 의 새로운 소식이 업데이트 되었습니다. </div>

                <div><span>{news.bizName}</span> | <span>{news.alarmDate}</span></div>
            </div>
    )
}





