import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
export default function BizFile(props){

    //부모 컴포넌트에서 전달 받은 데이터 추출
    const { loginMember, loginOrg } = useUserStore();
    const donateBiz = props.donateBiz;
    const bizNo = props.bizNo; // 잘 나옴

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    // 로그인 했고, 관리자 이거나, 기부단체 계정인 경우에만 isManagerOrOrg 값 true
    const isManagerOrOrg = 
    (loginMember && loginMember.memberLevel === 1) ||
    (loginOrg && donateBiz && loginOrg.orgNo === donateBiz.orgNo);
    
    // 첨부파일 관련 변수 선언 
    const bizFile = props.bizFile;
    const setBizFile = props.setBizFile;

    // 기존 파일 리스트 변수 선언
    const prevBizFileList = props.prevBizFileList;
    const setPrevBizFileList = props.setPrevBizFileList;

    // 삭제한 파일 번호 변수 선언
    const delBizFileNo = props.delBizFileNo;
    const setDelBizFileNo = props.setDelBizFileNo;

    //사용자가 업로드한 첨부파일을 화면에 보여주기 위한 용도의 변수
    const [bizFileImg, setBizFileImg] = useState([]); //업로드한 파일명

    const [isEditMode, setIsEditMode] = useState(false); // 첨부파일 수정 모드 여부 상태값 변수 선언

  
  


    //첨부파일 업로드 시, 동작 함수(onChange)
    function chgBizFile(e){
        const files = e.target.files;   //유사 배열이라 배열에서 제공되는 map 함수 사용 불가

        const fileArr = new Array();    //부모 컴포넌트에서 전달한 첨부파일 배열 State 변수에 매개변수로 전달할 배열
        const fileNameArr = new Array();//화면에 첨부파일 목록을 노출시키기 위한 배열

        for(let i=0; i<files.length; i++){ //사용자가 업로드한 파일's 순회
            fileArr.push(files[i]); 
            fileNameArr.push(files[i].name);
        }
        /*
        fileArr, fileNameArr 앞에 전개 연산자(...)를 생략하면, 배열 자체가 하나의 요소로 추가된다.

        let aArr = ['a', 'b'];
        let bArr = ['c', 'd'];

        [...aArr, ...bArr]     =>    ['a', 'b', 'c', 'd']
        [...aArr, bArr]        =>    ['a', 'b', ['c', 'd']]
        
        */
        //State 변수 변경
        setBizFile([...bizFile, ...fileArr]);              //파일 객체 배열
        setBizFileImg([...bizFileImg, ...fileNameArr]);    //파일 이름 배열
    }

    // 파일 업로드 버튼 클릭 시 호출되는 함수
    function updateFile(){
        const form = new FormData();
        
        // bizNo 보내기
        form.append("bizNo", bizNo);
        //추가 첨부파일
        for(let i=0; i<bizFile.length; i++){
            form.append('bizFile', bizFile[i]);
        }
        //기존 첨부파일 중, 삭제 대상 파일
        for(let i=0; i<delBizFileNo.length; i++){
            form.append('delBizFileNo', delBizFileNo[i]);
        }
        
        // 수정한 파일 정보 보내기
        let options = {};
            options.url = serverUrl + '/biz/file';
            options.method = 'post'; //수정 == PUT or PATCH == 일부 컬럼 정보 수정 == PATCH
            options.data = form;
            
            options.headers = {};
            options.headers.contentType = 'multipart/form-data';
            options.headers.processData = false; //쿼리 스트링 변환 X
            

            axiosInstance(options)
            .then(function(res){
                if(res.data.resData){

                    fetchBizFileList(); //수정사항 반영 -> 재조회 
                   
                    // 업로드 된 파일 목록 초기화
                    setBizFile([]);
                    setBizFileImg([]);
                    setDelBizFileNo([]);

                    // 수정 보드 종료
                    setIsEditMode(false);
                }
            });
        
    }

    // 첨부파일 목록 다시 가져오기
    function fetchBizFileList() {
    axiosInstance.get(serverUrl + "/biz/" + bizNo)
    .then(function(res) {
        setPrevBizFileList(res.data.resData.fileList); // 최신 파일 목록으로 갱신
    });
}


    return(
        <>
        {/* 수정 모드 아닌 경우 */}
        {!isEditMode && (
        <div className="file-view-wrap">
            <div className="file-view-header">
            <p className="file-title">첨부파일</p>
                {isManagerOrOrg &&
                <button type="button" className="btn-edit" onClick={() => setIsEditMode(true)}>
                    수정
                </button>
                }
            </div>

            <div className="file-list">
                {
                prevBizFileList.length > 0
                ? prevBizFileList.map((file, index) => (
                    <FileItem key={"file" + index} file={file} />
                    ))
                : <p>등록된 첨부파일이 없습니다.</p>
                }
            </div>
            </div>
        )}
        
        {/* 수정 모드 진입 */}
        {isEditMode && (
        <div className="file-edit-wrap">
            <form className="file-form" onSubmit={function(e){
                                        e.preventDefault();
                                        updateFile();
            }}>
            {isManagerOrOrg && (
            <div className="file-upload-box">
                <label className="file-upload-btn" htmlFor="bizFile">파일첨부하기</label>
                <input type="file" id="bizFile" multiple onChange={chgBizFile} style={{ display: 'none' }} />
            </div>
            )}

            <div className="file-list-edit">
                {prevBizFileList.map(function(oldFile, index){
                return(
                    <div className="file-item" key={"old-file" + index}>
                    <span className="file-name">{oldFile.fileName}</span>
                    <span className="material-icons del-file-icon" onClick={() => {
                    const newList = prevBizFileList.filter(function(fOldFile, fIndex){
                        return oldFile != fOldFile;
                    })
                    setPrevBizFileList(newList); //화면에서 삭제

                    //서버에서도 파일 삭제를 위해, 삭제 아이콘을 클릭한 파일의 파일 번호를 변수에 세팅
                    setDelBizFileNo([...delBizFileNo, oldFile.fileNo]); 
                }}>delete</span>
                </div>
                );
            })}

                {bizFileImg.map(function(fileName, index){
                return(
                    <div className="file-item" key={"new-file" + index}>
                        <span className="file-name">{fileName}</span>
                        <span className="material-icons del-file-icon" onClick={() => {
                        bizFileImg.splice(index, 1);
                        setBizFileImg([...bizFileImg]);
                        bizFile.splice(index, 1);
                        setBizFile([...bizFile]);
                        }}>delete</span>
                    </div>
                );
                })}
            </div>

            <div className="button-zone">
                <button type="submit" className="btn-primary">저장</button>
            </div>
            </form>
        </div>
        )}
       </>
    )

}



//파일 1개 정보
function FileItem(props) {
    const file = props.file;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //파일 다운로드 아이콘 클릭 시, 동작 함수
    function fileDown(){
        let options = {};
        options.url = serverUrl + '/biz/file/' + file.fileNo;
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