import { useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import NewsFrm from "./NewsFrm";
import ToastEditor from "./ToastEditor";
import Swal from "sweetalert2";

export default function NewsUpdate(){

    const param = useParams(); //NewsView에서 URL에 포함시켜 전달한 게시글 번호 추출을 위함.
    const newsNo = param.newsNo;
    console.log(newsNo);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const {loginMember} = useUserStore();    

    const [newsName, setNewsName] = useState("");       //게시글 제목
    const [newsThumb, setNewsThumb] = useState(null);     //게시글 썸네일 이미지 파일 객체 
    const [newsContent, setNewsContent] = useState("");   //게시글 내용
    const [orgName, setOrgName] = useState("");                 // 기부단체명
    const [orgNo, setOrgNo] = useState("");         // 대상 기부 단체번호

    const [prevThumbPath, setPrevThumbPath] = useState(null);           //기존 썸네일 서버 저장 파일명

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/news/' + newsNo; //상세보기 진입 시, 사용 API 재사용 
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            const news = res.data.resData;

            setNewsName(news.newsName);        //기존 제목
            setNewsContent(news.newsContent);    //기존 본문 내용
            setPrevThumbPath(news.newsThumbPath); //20250624162600775_04771.jpg
            setOrgName(news.orgName);   // 기부 단체명
            setOrgNo(news.orgNo);
        });
    }, []);

    
    const navigate = useNavigate();

    function updateNews(){
        
        Swal.fire({
            title : '알림',
            text : '소식글을 수정하시겠습니까?',
            icon : 'question',
            showCancelButton : true,
            confirmButtonText : '확인',
            cancelButtonText : '취소'
        }).then(function(res){
            if(res.isConfirmed){
                if(newsName != null && newsContent != null){
                const form = new FormData();

                form.append('newsNo', newsNo);                                //게시글 번호
                form.append('newsName', newsName);                          //게시글 제목
                form.append('newsContent', newsContent);                      //게시글 본문 내용
                form.append('orgNo', orgNo);

                //기존 썸네일 파일명
                if(prevThumbPath != null){
                    form.append('prevThumbPath', prevThumbPath);
                }
                //새롭게 등록한 썸네일 파일 객체
                if(newsThumb != null){
                    form.append('newsThumb', newsThumb);
                }

                let options = {};
                options.url = serverUrl + '/news';
                options.method = 'patch'; //수정 == PUT or PATCH == 일부 컬럼 정보 수정 == PATCH
                options.data = form;
                options.headers = {};
                options.headers.contentType = 'multipart/form-data';
                options.headers.processData = false; //쿼리 스트링 변환 X

                axiosInstance(options)
                .then(function(res){
                    if(res.data.resData){
                        navigate('/news/view/'+newsNo);
                    }
                });
        }
        }  
    });  
    }


    return(
    <section className="section board-content-wrap">
            <div className="page-title">소식글 수정</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                updateNews(); //수정하기 함수 호출
            }}> 
                <NewsFrm loginMember={loginMember}
                          newsName={newsName}
                          setNewsName={setNewsName}
                          newsThumb={newsThumb}
                          setNewsThumb={setNewsThumb}
                          prevThumbPath={prevThumbPath}
                          setPrevThumbPath={setPrevThumbPath}
                          orgName={orgName}
                          setOrgName={setOrgName}
                          orgNo={orgNo}
                          setOrgNo={setOrgNo}
                          />
                                <div className="board-content-wrap">
                                    <ToastEditor newsContent={newsContent} setNewsContent={setNewsContent}
                                                 type={1}/>
                                </div>
                <div className="button-zone">
                    <button type="submit" className="btn-primary lg">
                        수정하기
                    </button>
                </div>
            </form>
        </section>

    )
}