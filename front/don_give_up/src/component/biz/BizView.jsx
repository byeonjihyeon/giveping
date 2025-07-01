import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";

export default function BizView(){
    const param = useParams();
    const bizNo = param.bizNo;
    console.log(bizNo);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [donateBiz, setDonateBiz] = useState({});

    //로그인 회원 정보 (수정, 삭제 버튼 활성화)
    //const {loginMember} = useUserStore(); 


    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/biz/' + bizNo;
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            setDonateBiz(res.data.resData);
        });

    }, []);

    const navigate = useNavigate();
    //삭제하기 클릭 시, 동작 함수
    /*
    function deleteBoard(){
        let options = {};
        options.url = serverUrl + '/biz/' + board.bizNo;
        options.method = 'delete';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                navigate('/biz/list');
            }
        });
    }
    */


    return (
        <section>
            <div className="page-title">게시글 상세 보기</div>
            <div className="board-view-content">
                <div className="board-view-info">
                    <div className="board-thumbnail">
                        <img src={
                            donateBiz.bizThumbPath
                            ? serverUrl + "/biz/thumb/" + donateBiz.bizThumbPath.substring(0,8) + "/" + donateBiz.bizThumbPath
                            : "/images/default_img.png"
                        } />
                    </div>
                    <div className="board-view-preview">
                        <table className="tbl">
                            <tbody>
                                <tr>
                                    <td className="left" colSpan={4}>
                                        {donateBiz.bizName}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width:"20%"}}>작성자</th>
                                    <td style={{width:"20%"}}>{donateBiz.orgName}</td>
                                    <th style={{width:"20%"}}>사업신청검토일자</th>
                                    <td style={{width:"20%"}}>{donateBiz.bizRegDate}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="file-title">첨부파일</p>
                        <div className="file-zone">
                            {
                                donateBiz.fileList
                                ? donateBiz.fileList.map(function(file, index){
                                    return <FileItem key={"file"+index} file={file} />
                                  })
                                : ''
                            }
                        </div>
                    </div>
                </div>
                
                <hr/>

                <div className="board-content-wrap"> 
                    {
                        donateBiz.bizContent
                        ? <Viewer initialValue={donateBiz.bizContent} />
                        : ''
                    }
                     <table style={{ width: '100%', marginTop: '20px' }} className="donate-info-table">
                        <tbody>
                        <tr>
                            <th style={{ width: '20%' }}>기부카테고리</th>
                            <td style={{ width: '30%' }}>{donateBiz.donateCtg}</td>
                            <th style={{ width: '20%' }}>모금 시작일</th>
                            <td style={{ width: '30%' }}>{donateBiz.bizDonateStart}</td>
                        </tr>
                        <tr>
                            <th>모금 종료일</th>
                            <td>{donateBiz.bizDonateEnd}</td>
                            <th>기부사업 시작일</th>
                            <td>{donateBiz.bizStart}</td>
                        </tr>
                        <tr>
                            <th>기부사업 종료일</th>
                            <td>{donateBiz.bizEnd}</td>
                            <th>목표모금금액</th>
                            <td>{donateBiz.bizGoal}(원)</td>
                        </tr>
                        <tr>
                            <th>사업신청검토일자</th>
                            <td>{donateBiz.bizRegDate}</td>
                        </tr>
                        <tr>
                            <th>수정 사항</th>
                            <td colSpan="3">{donateBiz.bizEdit}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                
                {/* 
                {
                    loginMember != null && loginMember.memberId == board.boardWriter
                    ?
                    <div className="view-btn-zone">
                        <Link to={'/biz/update/' + donateBiz.bizNo} className="btn-primary lg">수정</Link>
                        <button type="button" className="btn-secondary lg" onClick={deleteBiz}>삭제</button>
                    </div>
                    : ''
                }
                    */}
            </div>
        </section>
    );
}

//파일 1개 정보
function FileItem(props) {
    const file = props.file;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //파일 다운로드 아이콘 클릭 시, 동작 함수
    function fileDown(){
        let options = {};
        options.url = serverUrl + '/biz/file/' + donateBiz.bizFileNo;
        options.method = 'get';
        options.responseType = 'blob'; //서버에서 파일(바이너리)을 응답받기 위함.

        axiosInstance(options)
        .then(function(res){
            //res.data => 서버에서 응답해준 리소스
            const fileData = res.data;
            const blob = new Blob([fileData]); //단건이여도, 배열로 전달해야 함.
            const url = window.URL.createObjectURL(blob); //브라우저에 요청하기 위한 URL 생성

            //가상의 a태그 생성하고, 화면에서는 숨김 => 동적으로 클릭 이벤트 발생 => a태그 삭제
            const link = document.createElement("a");
            link.href = url;                                //다운로드 요청 URL 지정
            link.style.display = 'none';                    //a 태그 화면에서 숨기기 위함
            link.setAttribute('download', file.fileName);   //다운로드할 파일명 지정
            document.body.appendChild(link);                //body 태그 하위로 삽입
            link.click();                                   //동적으로 클릭하여, 다운로드 유도
            link.remove();                                  //a 태그 삭제

            window.URL.revokeObjectURL(url); //URL 정보 삭제
        });
    }


    return (
        <div className="board-file">
            <span className="material-icons file-icon" onClick={fileDown}>file_download</span>
            <span className="file-name">{file.fileName}</span>
        </div>
    );
}