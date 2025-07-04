import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import createInstance from '../../axios/Interceptor';
import { useState } from 'react';
import { useRef } from 'react';
import useUserStore from '../../store/useUserStore';
import { useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";


//기부 사업 등록
export default function OrgPost(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    const {loginOrg} = useUserStore();

    const [donateBiz, setDonateBiz] = useState({
        orgNo : loginOrg.orgNo, //단체 번호
        donateCode : "",        //기부 코드
        bizName : "",           //사업명
        bizContent : "",        //사업 내용
        bizDonateStart : "",    //모금 시작 날짜(사업 승인 날짜)
        bizDonateEnd : "",      //모금 종료 날짜
        bizStart : "",          //사업 시작 날짜
        bizEnd : "",            //사업 종료 날짜
        bizGoal : 0             //목표 후원 금액
    });

    const [bizPlanList, setBizPlanList] = useState([{
        bizPlanPurpose : "",    //사용 용도 및 산출 근거
        bizPlanMoney : ""       //금액
    }]);

/*  모금 기간 정하기
    모금 시작 날짜 == 사업 승인 날짜
    사업 시작 날짜는 사업 승인 날짜랑 다를 수 있음
    근데 사업 승인 날짜에서 모금 기간을 더하면 의미가 있나?
    사업 종료 날짜랑 모금 종료 날짜랑 같아야 하는 거 아닌가?
    function selectDonateDate(e){
        const donateTerm = e.target.value;

        setDonateBiz({...donateBiz, })
    }
*/

    //사업 시작 날짜, 사업 종료 날짜, 사업명 변경 시 onChange 호출
    function chgBiz(e){
        donateBiz[e.target.id] = e.target.value;
        setDonateBiz({...donateBiz});
    }

    //사용 계획 추가 클릭 시 호출 함수
    function addBizPlan(){
        const newBizPlan = {bizPlanPurpose : "", bizPlanMoney : ""};
        setBizPlanList([...bizPlanList, newBizPlan]);
    }

    //DB에서 조회한 카테고리 리스트 저장할 변수
    const [donateCtgList, setDonateCtgList] = useState([]);

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setDonateCtgList(res.data.resData);
        });
    }, []);

    //기부 카테고리 선택 시 호출 함수
    function selectDonateCtg(e){
        setDonateBiz({...donateBiz, donateCode : e.target.value});
    }

    const [bizThumbImg, setBizThumbImg] = useState(null);   //대표 사진 미리보기용 변수(서버 전송X)
    const [bizImg, setBizImg] = useState(null);             //대표 사진 객체(서버 전송O)

    //대표 사진 변경 시 호출 함수
    function chgBizThumb(e){
        const files = e.target.files;

        if(files.length != 0 && files[0] != null){
            setBizImg(files[0]);    //서버에 전송할 이미지 파일 객체 세팅

            //대표 사진 화면에 보여주기
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function(){
                setBizThumbImg(reader.result);
            }
        }else{
            //업로드 팝업 취소 시 초기화
            setBizImg(null);
            setBizThumbImg(null);
        }
    }

    const editorRef = useRef(null); //에디터와 연결할 ref 변수

    function changeContent(){
        //에디터 본문에 작성한 내용 State 변수에 세팅
        const editorText = editorRef.current.getInstance().getHTML();
        setDonateBiz({...donateBiz, bizContent : editorText});
    }

    //에디터 상단 이미지 아이콘 클릭하여 이미지 업로드 후 OK 버튼 클릭 시 동작 함수
    /*
    에디터 이미지 업로드 시 처리 순서
    (1) 서버에 비동기 요청하여 이미지를 업로드
    (2) 서버에서는 업로드한 이미지 파일 경로를 응답
    (3) 매개변수로 전달받은 callbackFunc에 이미지 경로를 작성하여 에디터에 내부에 이미지 표기
    */
    function uploadImg(file, callbackFunc){
        /*
        //파일 업로드 처리 (post, multipart/form-data)
        const form = new FormData(); //웹 API (자바스크립트 내부 객체)
        form.append("image", file);

        let options = {};
        options.url = serverUrl + "/board/editorImage";
        options.method = "post";
        options.data = form;
        options.headers = {};
        options.headers.contentType = "multipart/form-data";
        options.headers.processData = false;    //전송 데이터를 쿼리스트링으로 변환할지에 대한 값

        axiosInstance(options)
        .then(function(res){
            //res.data.resData -> "/editor/20250624/2025062415161010_00342.jpg"
            
            /*
            리액트로 생성한 정적 웹 사이트는 보안상의 이유로 파일 시스템(C 드라이브)에 직접적으로 접근할 수 없다
            파일 시스템에 저장된 이미지를 브라우저에 보여주고자 할 때 백엔드 서버에 요청을 해야 함

            http://localhost:9999/editor/20250624/2025062415161010_00342.jpg
            
            callbackFunc(serverUrl + res.data.resData, "이미지");
        
        });
        */
    }

    //등록 버튼 클릭 시 실행 함수
    function insertBizPlan(){
        console.log(donateBiz);
        console.log(bizPlanList);
    }

    return (
        <div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                insertBizPlan();//등록 버튼 클릭 시 실행 함수
            }}>
                <div>
                    <div>희망 모금 기간</div>
                    <FormControl>
                        <RadioGroup row name="biz-donate-date" /*onChange={selectDonateDate}*/
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                            <FormControlLabel value="30" control={<Radio />} label="30일" />
                            <FormControlLabel value="60" control={<Radio />} label="60일" />
                            <FormControlLabel value="90" control={<Radio />} label="90일" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <div>사업 기간</div>
                    <div style={{display : "flex"}}>
                        <div className="biz-start">
                            <div>시작일</div>
                            <input type="date" id="bizStart" onChange={chgBiz}/> ~ &nbsp;
                        </div>
                        <div className="biz-end">
                            <div>종료일</div>
                            <input type="date" id="bizEnd" onChange={chgBiz}/>
                        </div>
                    </div>
                </div>
                <div>
                    <div>모금액 사용 계획</div>
                    <div>
                        {bizPlanList.map(function(bizPlan, index){
                            return  <BizPlan key={"bizPlan"+index} bizPlan={bizPlan} index={index} bizPlanList={bizPlanList} setBizPlanList={setBizPlanList}
                                            donateBiz={donateBiz} setDonateBiz={setDonateBiz}/>
                        })}
                        <button type="button" onClick={addBizPlan}>사용 계획 추가</button>
                    </div>
                    <span>목표 금액 : {donateBiz.bizGoal}원</span>
                </div>
                <div>
                    <div>기부 카테고리 선택</div>
                    <FormControl>
                        <RadioGroup row name="biz-donate-date" onChange={selectDonateCtg}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                            {donateCtgList.map(function(category, index){
                                return <FormControlLabel key={"category"+index} value={category.donateCode} control={<Radio />} label={category.donateCtg}/>
                            })}
                        </RadioGroup>
                    </FormControl>
                </div>
                <hr/>
                <div>
                    <div>기부 사업명</div>
                    <input type="text" id="bizName" value={donateBiz.bizName} onChange={chgBiz}/>
                </div>
                <div>
                    <div>대표 사진 등록</div>
                    <img src={bizThumbImg ? bizThumbImg : "/images/default_img.png"} style={{width : "100px"}}/>
                    <label htmlFor="bizThumbPath">이미지 등록</label>
                    <input type="file" id="bizThumbPath" style={{display : "none"}} onChange={chgBizThumb}/>
                </div>
                <div>
                    <div>본문</div>
                    <Editor ref={editorRef} initialValue={donateBiz.bizContent}
                            initialEditType="wysiwyg" language="ko-KR" height="600px"
                            onChange={changeContent} hooks={{addImageBlobHook : uploadImg}}/>
                </div>
                <div>
                    <button type="submit">등록</button>
                </div>
            </form>
        </div>
        
    );
}

//모금액 사용 계획
function BizPlan(props){
    const bizPlan = props.bizPlan;
    const index = props.index;
    const bizPlanList = props.bizPlanList;
    const setBizPlanList = props.setBizPlanList;
    const donateBiz = props.donateBiz;
    const setDonateBiz = props.setDonateBiz;

    //입력 시 onChange 호출
    function chgBizPlan(e){
        const {name, value} = e.target;

        // 1. 기존 배열 복사
        const newBizPlanList = [...bizPlanList];

        // 2. 해당 인덱스의 항목만 변경
        newBizPlanList[index] = {...newBizPlanList[index], [name]: value};

        // 3. 상태 업데이트
        setBizPlanList(newBizPlanList);

        let totalBizGoal = 0;
        for(let i=0; i<newBizPlanList.length; i++){
            const planMoney = Number(newBizPlanList[i].bizPlanMoney);
            totalBizGoal += planMoney;
        }

        setDonateBiz({...donateBiz, bizGoal : totalBizGoal});
    }

        //삭제 버튼 클릭 시 호출 함수
    function deleteBizPlan(index){
        if(index != 0){
            bizPlanList.splice(index, 1);

            let totalBizGoal = 0;
            for(let i=0; i<bizPlanList.length; i++){
                const planMoney = Number(bizPlanList[i].bizPlanMoney);
                totalBizGoal += planMoney;
            }

            setBizPlanList([...bizPlanList]);
            setDonateBiz({...donateBiz, bizGoal : totalBizGoal});
        }
    }

    return(
        <div name="div-bizPlan">
            <input type="text" name="bizPlanPurpose" placeholder="사용 근거" value={bizPlan.bizPlanPurpose} onChange={chgBizPlan}/>
            <input type="text" name="bizPlanMoney" placeholder="사용 금액" value={bizPlan.bizPlanMoney} onChange={chgBizPlan}/>
            {index != 0
            ?<span onClick={function(){deleteBizPlan(index)}}> ⛔</span>
            : ""}
        </div>
    )
}
