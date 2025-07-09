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
        console.log("updateFile 함수 호출");
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
                console.log(res.data.resData); //true or false
                if(res.data.resData){
                    console.log("resData", res.data.resData)

                    fetchBizFileList(); //수정사항 반영 -> 재조회 
                    window.location.reload();
                }
            });
        
    }

    // 첨부파일 목록 다시 가져오기
    function fetchBizFileList() {
    console.log("fetchBizFileList 함수 도착");
    axiosInstance.get(serverUrl + "/biz/" + bizNo)
    .then(function(res) {
        console.log(" fileList 재갱신: " , res.data.resData.fileList);
        setPrevBizFileList(res.data.resData.fileList); // 최신 파일 목록으로 갱신
    });
}


    return(
        <>
        {/* 수정 모드 아닌 경우 */}
        {!isEditMode && 
            <div className="no-login">
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
        }
        
        {isManagerOrOrg &&
                <div className="btn-zone">
                    <button type="button" className="btn-primary" onClick={() => setIsEditMode(true)}>
                        수정하기
                    </button>
                </div>
            }
        

        {isEditMode &&     
        <div className="manager-login">
        <section className="section biz-content-wrap">
                            <div className="page-title">첨부파일 섹션</div>
                            <form className="bizFile" onSubmit={function(e){
                                e.preventDefault();
                                updateFile(); //파일 업로드 함수 호출
                                setIsEditMode(false); // 수정 완료 -> 다시 비수정 모드로
                                //window.location.reload();   // 새로고침 -> 파일 변경사항 반영
                            }}> 
            <div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <label>첨부파일</label>
                                </th>
                                {isManagerOrOrg && (
                                <td className="left">
                                    <label htmlFor="bizFile" className="btn-primary sm">파일첨부</label>
                                    <input type="file" id="bizFile" style={{display : 'none'}} multiple onChange={chgBizFile} />
                                </td>
                                )}
                            </tr>
                            <tr>
                                <th>첨부파일 목록</th>
                                <td>
                                    <div className="biz-file-wrap">
                                        {
                                            prevBizFileList
                                            ? prevBizFileList.map(function(oldFile, index){
                                                console.log("oldFile 전체 구조 확인:", oldFile); // ← 이걸로 구조 확인 가능
                                                console.log("oldFile.fileNo:", oldFile.fileNo); // ← undefined

                                                //기존 파일 삭제 아이콘 클릭 시, 호출 함수
                                                function deleteFile(){
                                                    console.log("현재 삭제 대상 파일 번호:", oldFile.fileNo);
                                                    console.log("삭제 전 delBizFileNo:", delBizFileNo);
                                                    const newFileList = prevBizFileList.filter(function(fOldFile, fIndex){
                                                        return oldFile != fOldFile;
                                                    })
                                                    setPrevBizFileList(newFileList); //화면에서 삭제

                                                    //서버에서도 파일 삭제를 위해, 삭제 아이콘을 클릭한 파일의 파일 번호를 변수에 세팅
                                                    setDelBizFileNo([...delBizFileNo, oldFile.fileNo]); 
                                                }

                                                //oldFile == BizFile 객체
                                                return <p key={"old-file"+index}>
                                                            <span className="fileName">{oldFile.fileName}</span>
                                                           {isManagerOrOrg && (
                                                                <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                                    delete
                                                                </span>
                                                            )}
                                                    </p>
                                            })
                                            : ''
                                        }
                                        {
                                            bizFileImg.map(function(fileName, index){
                                                
                                                //배열의 각 요소마다 적용되는 함수
                                                function deleteFile(){

                                                    //파일 이름 배열에서 제거
                                                    bizFileImg.splice(index, 1);
                                                    setBizFileImg([...bizFileImg]);

                                                    //파일 객체 배열에서 제거
                                                    bizFile.splice(index, 1);
                                                    setBizFile([...bizFile]);
                                                }


                                                return <p key={"new-file"+index}>
                                                            <span className="fileName">{fileName}</span>
                                                            <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                                delete
                                                            </span>
                                                    </p>
                                            })
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
       </div>

            {isManagerOrOrg && (
            <div className="button-zone">
                <button type="submit" className="btn-primary lg">
                    저장
                </button>
            </div>
           )}
        </form>
    </section>
    </div>  
    }  
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