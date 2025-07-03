import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
export default function BizFile(props){

    //부모 컴포넌트에서 전달 받은 데이터 추출
    const loginMember = props.loginMember;
    
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


    return(

       <div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <label>첨부파일</label>
                            </th>
                            <td className="left">
                                <label htmlFor="bizFile" className="btn-primary sm">파일첨부</label>
                                <input type="file" id="bizFile" style={{display : 'none'}} multiple onChange={chgBizFile} />
                            </td>
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
                                                        <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                            delete
                                                        </span>
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
    )

}