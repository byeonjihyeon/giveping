 import {Editor} from '@toast-ui/react-editor';
 import '@toast-ui/editor/dist/toastui-editor.css';
import { useEffect, useRef } from 'react';
import createInstance from '../../axios/Interceptor';

 //소식 본문 내용 작성을 위한 에디터
 export default function ToastEditor(props){
    const newsContent = props.newsContent;
    const setNewsContent = props.setNewsContent;
    const type=props.type; // 등록 : 0 ,수정 : 1
    //기부 사업 등록에 필요한 변수
    const donateBiz = props.donateBiz;
    const setDonateBiz = props.setDonateBiz;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const editorRef = useRef(null); //에디터와 연결할 ref 변수

    useEffect(function() {
        if (donateBiz && donateBiz.bizContent && editorRef.current) {
            editorRef.current.getInstance().setHTML(donateBiz.bizContent);
        }
    }, [donateBiz.bizContent]);

    function changeContent(){
        //에디터 본문에 작성한 내용 state 변수에 세팅
        const editorText = editorRef.current.getInstance().getHTML(); //<ul>밑줄</ul>
        if(setNewsContent && !setDonateBiz){
            setNewsContent(editorText);
        }else{
            setDonateBiz({...donateBiz, bizContent : editorText});
        }
    }

    


    // 에디터 상단, 이미지 아이콘 클릭하여 이미지 업로드 후, OK 버튼 클릭 시 동작 함수
    function uploadImg(file, callbackFunc){
        // 파일 업로드 처리 (post, multipart/form-data)
        const form = new FormData(); // 웹 API (자바스크립트 내장 객체)
        form.append("image", file);

        let options = {};
        if(newsContent && !donateBiz.bizContent){
            options.url = serverUrl + "/news/editorImage";
        }else{
            options.url = serverUrl + "/biz/editorImage";
        }
        options.method='post';
        options.data = form;
        options.headers = {};
        options.headers.contentType="multipart/form-data";
        options.headers.processData = false; //(기본값 true) 전송 데이터를 쿼리스트링으로 변환할지에 대한 여부

        axiosInstance(options)
        .then(function(res){
            //res.data.resData = > "/editor/20250624/202506251234220487_23422.jpg"
            console.log(res.data.resData);
            callbackFunc(serverUrl + res.data.resData);
        });
    }

    return(
        <div style={{width: '100%', marginTop : '20px'}}>
            {type == 0 || (type == 1 && newsContent != '')
            ?
                <Editor ref={editorRef} 
                        initialValue={newsContent}
                        initialEditType="wysiwyg"
                        language="ko-KR"
                        height="600px"
                        onChange={changeContent}
                        hooks={{
                            addImageBlobHook : uploadImg
                        }}
                >
                </Editor>
            : donateBiz
                ? type == 0 || (type == 1 && donateBiz.bizContent != "")
                    ?
                        <Editor ref={editorRef} 
                            initialValue={donateBiz.bizContent}
                            initialEditType="wysiwyg"
                            language="ko-KR"
                            height="600px"
                            onChange={changeContent}
                            hooks={{
                                addImageBlobHook : uploadImg
                            }}
                        >
                        </Editor>
                    : ""
                : ""
            }
        </div>    
    )

 }