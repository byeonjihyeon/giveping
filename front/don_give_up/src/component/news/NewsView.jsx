import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
export default function NewsView(){
    const param = useParams();
    const newsNo = param.newsNo;
    console.log(newsNo);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [news, setNews] = useState({});

    //로그인 회원 정보 (관리자일 경우에만 수정, 삭제 버튼 활성화)
    //const {loginMember} = useUserStore(); 

    // 댓글 리스트 저장 변수
    const [commentList, setCommentList] = useState([]);

    // 소식글 상세 정보 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/news/' + newsNo;
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNews(res.data.resData);
        });

    }, []);

    // 소식글 댓글 리스트 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/news/comment/' + newsNo;
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setCommentList(res.data.resData);
        });

    }, []);

    const navigate = useNavigate();
    //삭제하기 클릭 시, 동작 함수

    function deleteNews(){
        let options = {};
        options.url = serverUrl + '/news/' + news.newsNo;
        options.method = 'delete';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            if(res.data.resData){
                navigate('/news/list');
            }
        });
    }

    


    return(
        <>
    <section className="section board-view-wrap">
            <div className="page-title">게시글 상세 보기</div>
            <div className="board-view-content">
                <div className="board-view-info">
                    <div className="board-thumbnail">
                        <img src={
                            news.newsThumbPath
                            ? serverUrl + "/news/thumb/" + news.newsThumbPath.substring(0,8) + "/" + news.newsThumbPath
                            : "/images/default_img.png"
                        } />
                    </div>
                    <div className="board-view-preview">
                        <table className="tbl">
                            <tbody>
                                <tr>
                                    <td className="left" colSpan={4}>
                                        {news.newsName}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width:"20%"}}>단체명</th>
                                    <td style={{width:"20%"}}>{news.orgName}</td>
                                    <th style={{width:"20%"}}>작성일</th>
                                    <td style={{width:"20%"}}>{news.newsDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <hr/>

                <div className="board-content-wrap">
                    {
                        news.newsContent
                        ? <Viewer initialValue={news.newsContent} />
                        : ''
                    }
                </div>
                {/* 
                {
                    loginMember != null && loginMember.memberId == board.boardWriter
                    ?
                    */}
                    <div className="view-btn-zone">
                        <Link to={"/news/update/" + news.newsNo} className="btn-primary lg">수정</Link>
                        <button type="button" className="btn-secondary lg" onClick={deleteNews}>삭제</button>
                    </div>
                {/* 
                    : ''
                }
                    */}
            </div>

            <hr /><hr /><hr /><hr />
            <table className="tbl">
            <thead>
                <tr>
                    <th style={{width:"10%"}}>댓글번호</th>
                    <th style={{width:"10%"}}>회원이름</th>
                    <th style={{width:"10%"}}>소식번호</th>
                    <th style={{width:"30%"}}>댓글내용</th>
                    <th style={{width:"15%"}}>작성시간</th>
                    <th style={{width:"10%"}}>수정</th>
                    <th style={{width:"10%"}}>삭제</th>
                </tr>
            </thead>
            <tbody>
                {commentList.map(function(comment, index){
                    return <Comment key={"comment"+index} comment={comment} commentList={commentList} setCommentList={setCommentList}/>
                })}
            </tbody>
        </table>
        </section>
</>
    )
}

// 댓글 수정
function updComment(){
    console.log("수정");

}

//댓글 삭제
function delComment(){
    console.log("삭제");

}

// 댓글 컴포넌트
// loginMember은 storage 에서 가져오기 -> 본인일 경우(loginMember.memberNo == commentList의 comment.memberNo)에만 댓글 수정, 삭제 가능
function Comment(props){
    const comment = props.comment;
    const commentList = props.commentList;
    const setCommentList = props.setCommentList;


    return(
        <tr>
            <td>{comment.commentNo}</td>
            <td>{comment.memberName}</td>
            <td>{comment.newsNo}</td>
            <td>{comment.commentContent}</td>
            <td>{comment.commentTime}</td>
            <td onClick={updComment}>수정</td>
            <td onClick={delComment}>삭제</td>
        </tr>
    )
}