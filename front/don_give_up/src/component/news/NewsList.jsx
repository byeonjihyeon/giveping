import { useEffect, useState } from "react";
import PageNavi from "../common/PageNavi";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { Navigate, useNavigate } from "react-router-dom";



export default function NewsList(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [newsList, setNewsList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
   //const {istLogined} = useUserStore(); // 관리자 

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/news/list/" + reqPage;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNewsList(res.data.resData.newsList);
            setPageInfo(res.data.resData.pageInfo);
        })

    }, [reqPage]);

    return(
    <>
        <div className="page-title">소식</div>
        <table className="tbl">
            <thead>
                <tr>
                    <th style={{width:"10%"}}>소식번호</th>
                    <th style={{width:"40%"}}>제목</th>
                    <th style={{width:"15%"}}>작성일</th>
                    <th style={{width:"10%"}}>조회수</th>
                </tr>
            </thead>
            <tbody>
                {newsList.map(function(news, index){
                    return <NewsItem key={"news"+index} news={news} newsList={newsList} setNewsList={setNewsList}/>
                })}
            </tbody>
        </table>
        <div className="admin-page-wrap" style={{marginTop : "30px"}}>
            <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
    </>

    )
}

//게시글 1개
function NewsItem(props) {
    const news = props.news;
    //const serverUrl = import.meta.env.VITE_BACK_SERVER;
    //const axiosInstance = createInstance();
    //const newsList = props.newsList;
    //const setNewsList = props.setNewsList;
    const navigate = useNavigate();

     // 상태 값을 변경했을 때, 호출 함수 (onChange)
     /*
    function handleChange(){
        let options = {};
        options.url = serverUrl + "/news";
        options.method = 'patch';
        options.data = {newsNo : news.newsNo};

        axiosInstance(options)
        .then(function(res){
            //DB 정상 변경되었을 때, 화면에 반영
            console.log(res.data.resData); // true or false

            if(res.data.resData){
                setNewsList([...newsList]);
            }
        });
    }
        */

    return (
        <tr onClick={() => navigate('news/view/' + news.newsNo)}>
            <td>{news.newsNo}</td>
            <td>{news.newsName}</td>
            <td>{news.newsDate}</td>
            <td>{news.readCount}</td>
        </tr>
    );
}