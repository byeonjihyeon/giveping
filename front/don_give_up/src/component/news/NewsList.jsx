import { useEffect, useState } from "react";
import PageNavi from "../common/PageNavi";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { Link, useNavigate } from "react-router-dom";



export default function NewsList(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [newsList, setNewsList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
   const {loginMember} = useUserStore(); // 관리자만 글쓰기 가능 

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
    <section className="section news-list-wrap">
        <div className="content-wrapper">
            <div className="page-title">소식</div>
            {(loginMember?.memberLevel === 1)
            ? <Link to="/news/write" className="btn-primary">글쓰기</Link>
            : ''}
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
                        return <NewsItem key={"news"+index} news={news} newsList={newsList} setNewsList={setNewsList} index={index} />
                    })}
                </tbody>
            </table>
            <div className="admin-page-wrap" style={{marginTop : "30px"}}>
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </div>
    </section>
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
    const index = props.index;

    return (
        <tr onClick={() => navigate('/news/view/' + news.newsNo)}>
            <td>{index+1}</td>
            <td>{news.newsName}</td>
            <td>{news.newsDate}</td>
            <td>{news.readCount}</td>
        </tr>
    );
}