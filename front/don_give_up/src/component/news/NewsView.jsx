import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import './news.css';
import Swal from "sweetalert2";

export default function NewsView(){
    const param = useParams();
    const newsNo = param.newsNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [news, setNews] = useState({});

    //로그인 회원 정보 (관리자일 경우에만 수정, 삭제 버튼 활성화)
    const {isLogined, setIsLogined, loginMember, setLoginMember, loginOrg, setLoginOrg, setAccessToken, setRefreshToken} = useUserStore();

    // 댓글 리스트 저장 변수
    const [commentList, setCommentList] = useState([]);

    // 댓글 등록 시 입력 값 상태 변수
    const [newComment, setNewComment] = useState("");

    // 댓글 등록 핸들러
    function submitComment(){

        // 입력된 댓글 내용이 없을 경우 return
        if(!newComment.trim()){
            alert("댓글 내용을 입력해주세요");
            return;
        }

        let options={};
        options.url = serverUrl + "/news/comment";
        options.method="post";
        options.data ={
            memberNo : loginMember.memberNo,
            newsNo : newsNo,
            commentContent : newComment
        };

        console.log("loginMember.memberNo", loginMember.memberNo);
        console.log("newsNo", newsNo);
        console.log("newComment", newComment);
        
        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData); // 등록 완료 시, true 반환
            if(res.data.resData){
                // 등록 완료일 경우
                reloadCommentList(); // 댓글 목록 다시 불러오기
                setNewComment(""); // 입력창 비우기
            }
        })
            
    }

    // 댓글 조회 reload
    function reloadCommentList() {
        let options = {};
        options.url = serverUrl + '/news/' + newsNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNews(res.data.resData);
        });
    }


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

    const navigate = useNavigate();
    //삭제하기 클릭 시, 동작 함수

    function deleteNews(){
        Swal.fire({
            title : '알림',
            text : '소식글을 삭제 하시겠습니까?',
            icon : 'question',
            showCancelButton : true,
            confirmButtonText : '삭제',
            cancelButtonText : '취소'
        }).then(function(res){
            if(res.isConfirmed){
            
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
            }
    )};


        


    return(
        <>
    <section className="section board-view-wrap">
                <div className="board-view-content">
                <div className="board-view-info">
                    <div className="board-thumbnail">
                    <img
                        src={
                        news.newsThumbPath
                            ? serverUrl + "/news/thumb/" + news.newsThumbPath.substring(0, 8) + "/" + news.newsThumbPath
                            : "/images/default_img.png"
                        }
                        alt="뉴스 썸네일"
                    />
                    </div>

                    <div className="board-view-preview">
                        <h2 className="news-title">{news.newsName}</h2>
                            <div className="info-row">
                                <span className="info-item">{news.orgName}</span><br/>
                                <span className="info-item">작성시간 | </span>
                                <span className="info-item">{news.newsDate}</span><br/>
                                <span className="info-item">조회수 | </span>
                                <span className="info-item">{news.readCount}</span>
                            </div>
                    </div>
                </div>

                <hr />

                <div className="board-content-wrap">
                    {news.newsContent ? <Viewer initialValue={news.newsContent} /> : ""}
                </div>
                        {/*
                {(loginMember != null && (loginMember.memberLevel === 1 || loginOrg != null)) && (
                    
                )}
                    */ }
                    <div className="view-btn-zone">
                    <Link to={"/news/update/" + news.newsNo} className="btn-primary lg">
                        수정
                    </Link>
                    <button type="button" className="btn-secondary lg" onClick={deleteNews}>
                        삭제
                    </button>
                    </div> 
                </div>
                
            </section>
            
            <section className="section board-comment-wrap">
            <br />
            <hr />
            <br />
            <h3>댓글</h3>
            <br />
            {
                loginMember !=null && loginMember.memberLevel ==2
                ?
                <div className="comment-write-box">
                            <input type="text" 
                                   value={newComment} 
                                    onChange={function(e) {setNewComment(e.target.value);
                                                }}
                                    placeholder="댓글을 입력하세요" 
                                    style={{width: '70%', marginRight: '10px'}}
                                    className="comment-input"/>
                            <button className="btn-primary" onClick={submitComment}>등록</button>
                </div>
                :
                ''
            }
        
                <div className="comment-list-wrap">
                    <br />
                    {Array.isArray(news.commentList) &&
                    news.commentList.map(function(comment, index){
                        return <Comment key={"comment"+index} comment={comment} commentList={commentList} setCommentList={setCommentList} newsNo={newsNo} reloadCommentList={reloadCommentList}/>
                    })}
                </div>
                </section>
        
</>
    )
}


// 댓글 컴포넌트
function Comment(props){
    const {loginMember, isLogined, setIsLogined, setLoginMember, loginOrg, setLoginOrg, setAccessToken, setRefreshToken} = useUserStore();
    const comment = props.comment;
    const commentList = props.commentList;
    const setCommentList = props.setCommentList;
    const newsNo = props.newsNo;


    //수정 여부 판단하는 변수 (기본값 : false/ 수정 버튼 클릭 : true로 변경)
    const [editMode, setEditMode] = useState(false);

    //댓글 작성자인지 판단하는 변수 (기본값 : false/ 로그인세션과 댓글주인 일치 시 : true로 변경)
    //본인일 경우(loginMember.memberNo == commentList의 comment.memberNo)에만 댓글 수정, 삭제 가능
    const [isAuthor, setIsAuthor] = useState(false);

    // 댓글 수정 내용 저장하는 변수
    const [editedContent, setEditedContent] = useState(comment.commentContent);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 팝업 모달을 위한 변수 선언
    const [isReportOpen, setIsReportOpen] = useState(false);

    // 수정 버튼 클릭 시 호출되는 함수
    function handleEditClick(){
        setEditMode(true); // 수정 여부를 true 로 변경
    }

    // 수정 중, 취소 했을 때 호출되는 함수
    function handleCancelEdit(){
        setEditedContent(comment.commentContent);   // 수정 내용 저장하는 변수 원래 댓글 내용 넣기
        setEditMode(false); // 수정 여부를 false 로 변경
    }

    // 작성자인지 확인
    useEffect(function(){
        if(loginMember && comment && loginMember.memberNo == comment.memberNo){
            setIsAuthor(true);
        }else{
            setIsAuthor(false);
        }

    }, [loginMember, comment]);

    function handleSaveEdit(){
        let options = {};
        options.url = serverUrl + "/news/comment";
        options.method="patch";
        options.data = {
            commentNo : comment.commentNo,
            commentContent : editedContent,
        };

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
 
            if(res.data.resData){
                setEditMode(false);
                props.reloadCommentList();  // 댓글 목록 수정된 상태 (최신 상태)로 다시 불러오기
            }
            
        });
    }

    // 댓글 삭제 핸들러
    function delComment(commentNo){
        // filter 로 댓글 저장 변수에서 클릭한 대상의 댓글 없애기

        Swal.fire({
            title : '알림',
            text : '댓글을 삭제하시겠습니까?',
            icon : 'question',
            showCancelButton : true,
            confirmButtonText : '삭제',
            cancelButtonText : '취소'
        }).then(function(res){
            if(res.isConfirmed){
                let options = {};
                options.url = serverUrl + "/news/comment/" + commentNo;
                options.method = "patch";
                axiosInstance(options)
                .then(function(res){
                    // 삭제한 대상 댓글을 ui에서 필터로 삭제 처리
                    if(res.data.resData) {
                        props.reloadCommentList();
                    }
                    console.log(res.data.resData);
                });

            }

        });
    }

    

    // 신고하기 버튼 클릭
    function openReportPopup(){
        console.log("신고하기 버튼 클릭");
        setIsReportOpen(true);
    }

    // 팝업 닫기
    function closeReportPopup(){
        setIsReportOpen(false);
    }

    return (
    <div className="comment-item">
        <img
        src={
            comment.memberProfile
            ? serverUrl + "/member/" + comment.memberProfile.substring(0, 8) + "/" + comment.memberProfile
            : "/images/default_img.png"
        }
        alt="프로필"
        />

        <div className="comment-body">
        <div className="comment-meta">
            <span className="comment-author">{comment.memberId}</span>
            <span className="comment-time">{comment.commentTime}</span>

            {isAuthor && !editMode || loginMember.memberLevel === 1 && (
            <div className="comment-actions">
                <span className="comment-action-text" onClick={handleEditClick} style={{ marginLeft: "auto" }}>
                수정
                </span>
                <span className="comment-action-text" onClick={() => delComment(comment.commentNo)}>
                삭제
                </span>
            </div>
            )}
            {isAuthor && editMode && (
            <div className="comment-actions">
                <span className="comment-action-text" onClick={handleSaveEdit} style={{ marginLeft: "auto" }}>
                완료
                </span>
                <span className="comment-action-text" onClick={handleCancelEdit}>
                취소
                </span>
            </div>
            )}

            {isLogined &&
            loginMember?.memberNo != null &&
            loginMember.memberNo !== comment.memberNo && (
                <div className="comment-actions">
                <span className="comment-action-text" onClick={openReportPopup} style={{ marginLeft: "auto" }}>
                    신고
                </span>
                {isReportOpen && <Report onClose={closeReportPopup} comment={comment} />}
                </div>
            )}
        </div>

        <div className="comment-content">
            {editMode ? (
            <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="comment-edit-input"
            />
            ) : (
            <p>{comment.commentContent}</p>
            )}
        </div>
        </div>
    </div>
    );


}

// 신고 팝업
function Report(props){
    const onClose = props.onClose;
    const comment = props.comment;
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 선택된 신고 코드
    const [selectedCode, setSelectedCode] = useState("");

    // 신고 코드 리스트 변수 저장하기
    const [codeList, setCodeList] = useState([]);

    // 신고 코드 가져오기
    useEffect(function(){
    let option = {};
    option.url = serverUrl + "/news/comment/report";
    option.method = 'get';

    axiosInstance(option)
    .then(function(res){
        console.log(res.data.resData);
        setCodeList(res.data.resData);  // 신고 코드 리스트에 저장
    });
    },[])

    // 신고 상세 사유 변수 선언
    const [detailReason, setDetailReason] = useState("");


    function handleSelectChange(e) {
    setSelectedCode(e.target.value);
    }

     // 댓글 신고하기
    async function handleReportClick(){

        if (!selectedCode) {
        Swal.fire({
            title : '알림',
            text : '신고 사유를 선택해주세요.',
            icon : 'warning',
            showCancelButton : false,
            confirmButtonText : '확인'
        });
            return;
        }
        
        if (!detailReason) {
        Swal.fire({
            title : '알림',
            text : '신고 상세 사유를 입력해주세요.',
            icon : 'warning',
            showCancelButton : false,
            confirmButtonText : '확인'
        });
            return;
        }

        const res = await Swal.fire({
        title: '댓글을 신고하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '신고',
        cancelButtonText: '취소'
    });

    if (!res.isConfirmed) return;

    // 신고 요청
    let options = {};
    options.url = serverUrl + "/news/comment/report";
    options.method = "post";
    options.data = {
        commentNo: comment.commentNo,
        reportCode: selectedCode,
        reportMemberNo: loginMember.memberNo,
        detailReason: detailReason
    };

    axiosInstance(options)
    .then(function(res){
        console.log(res.data.resData);
        // 성공 -> 팝업 닫기
        onClose();
    });
}

    


    function chgDetailReason(e){
        setDetailReason(e.target.value);
    }
    
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>신고하기</h3>
                <div style={{ margin: "15px 0" }}>
                    <p><strong>신고 댓글</strong></p>
                    <div className="button-group">
                        <span>댓글 번호: {comment.commentNo}</span> <br />
                        <span>댓글 내용: {comment.commentContent}</span> <br />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <label htmlFor="reportCode"><strong>신고 사유 선택</strong></label>
                        <select id="reportCode" value={selectedCode} onChange={handleSelectChange}>
                            <option value="">-- 사유를 선택하세요 --</option>
                            {codeList.map((code) => (
                                <option key={code.reportCode} value={code.reportCode}>
                                    {code.reportReason}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input type="text" id="detailReason" name="detailReason" value={detailReason} onChange={chgDetailReason} placeholder="상세 사유 입력"></input>
                    </div>
                </div>

                <button onClick={handleReportClick}>신고하기</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );




}