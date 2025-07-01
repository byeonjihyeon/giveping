import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";
import NewsFrm from './NewsFrm';
import ToastEditor from "./ToastEditor";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
export default function NewsWrite(){
    //const {loginMember} = useUserStore(); // 관리자만 작성 가능
    
    const [newsName, setNewsName] = useState("");   // 소식 제목
    const [newsThumb, setNewsThumb] = useState(null);    // 소식 썸네일 이미지 파일 객체
    const [newsContent, setNewsContent] = useState("");     // 소식 글 내용
    const [orgName, setOrgName] = useState("");     // 대상 기부 단체명
    const [orgNo, setOrgNo] = useState("");         // 대상 기부 단체번호

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const navigate = useNavigate();

    // 소식 등록 버튼 클릭 시, 동작 함수
    function newsWrite(){
        if(newsName != '' && newsContent != ''){
            const form = new FormData();    //파일 업로드 시, 사용할 수 있는 내장 객체

            // 첫번째로 작성하는 문자열 ==> input의 name 속성값 역할을 함.
            form.append("newsName", newsName);
            form.append("newsContent", newsContent);
            //form.append("boardWriter", loginMember.memberId);   // 작성자 (관리자만 가능)
            form.append("boardWriter", 'admin');
            form.append("orgNo", orgNo);    // 대상 단체 번호

            if(newsThumb != null){ //썸네일 이미지 업로드한 경우에만
                form.append("newsThumb", newsThumb);
            }

            let options = {};
            options.method = 'post';
            options.url = serverUrl + '/news';
            options.data = form;
            options.headers = {};
            options.headers.contentType = "multiple/form-data";
            options.headers.processData = false;    //쿼리스트링으로 변환하지 않도록 설정

            axiosInstance(options)
            .then(function(res){
                // 게시글 정상 등록 시, BoardList 컴포넌트로 전환
                navigate("/news/list");
            });

        }else{
            Swal.fire({
                title : '알림',
                text : '게시글 제목과 내용은 필수 입력값입니다.',
                icon : 'warning'
            });
        }

    }



    return(
    <section className="section board-content-wrap">
            <div className="page-title">게시글 작성</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                newsWrite(); //등록하기 함수 호출
            }}>

                    {/* 게시글 작성과 수정하기 모두 UI는 동일하므로, 입력 요소들은 별도의 컴포넌트로 분리하여 작성.
                        props로 State 변수와 변경할 때 호출할 함수들 전달
                    */}
                    {/*<NewsFrm loginMember={loginMember} */}
                    <NewsFrm
                               newsName={newsName}
                               setNewsName={setNewsName}
                               newsThumb={newsThumb}
                               setNewsThumb={setNewsThumb}
                               orgName={orgName}
                               setOrgName={setOrgName}
                               orgNo={orgNo}
                               setOrgNo={setOrgNo}/>
                <div className="board-content-wrap">
                    <ToastEditor newsContent={newsContent} setNewsContent={setNewsContent}
                                 type={0}/>
                </div>
                <div className="button-zone">
                    <button type="submit" className="btn-primary lg">
                        등록하기
                    </button>
                </div>
            </form>
        </section>

    )
}