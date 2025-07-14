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
import ToastEditor from '../news/ToastEditor';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

export default function BizUpdate(){

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    const {loginOrg} = useUserStore();
    const orgNo = loginOrg.orgNo;
    const navigate = useNavigate();

    // BizView 에서 받아온 bizNo
    const {bizNo} = useParams();

    const editorRef = useRef();

    //서버에서 조회해온 게시글 1개 정보 저장 변수 (수정하기 전 변수)
    const [prevDonateBiz, setPrevDonateBiz] = useState({});

    // planList 저장 변수 (모금액 사용 계획)
    const [prevBizPlanList, setPrevPlanList] = useState([]);

    // 서버에서 기부 사업 상세 조회
    useEffect(function(){
            if(!bizNo) return; // 테스트용 임시 처리

            let options = {};
            options.url = serverUrl + '/biz/' + bizNo;
            options.method = 'get';
    
    
            axiosInstance(options)
            .then(function(res){
                console.log(res.data.resData);

                const data = res.data.resData;
                setPrevDonateBiz(data);
                setPrevPlanList(data.bizPlanList);
            });
    
        }, [bizNo]);

    // 불러온 기부 사업을 donateBiz 에 저장
    useEffect(function(){
        if (prevDonateBiz && prevDonateBiz.bizNo) {
             // 대표 사진 미리보기 설정
        const previewImg = prevDonateBiz.bizThumbPath 
            ? (serverUrl + "/biz/thumb/" + prevDonateBiz.bizThumbPath.substring(0,8)) + "/" + prevDonateBiz.bizThumbPath
            : "/images/default_img.png";

            setDonateBiz({
                ...prevDonateBiz,
                orgNo: orgNo,
                bizNo: Number(bizNo),
                bizPlanList: prevBizPlanList.length > 0 ? prevBizPlanList : [{}],
            });
            setBizPlanList(prevBizPlanList.length > 0 ? prevBizPlanList : [{bizPlanPurpose:"", bizPlanMoney:""}]);
         if (previewImg) {
            setBizThumbImg(previewImg);
        } else {
            setBizThumbImg("/images/default_img.png");
        }

        /*
        if (prevDonateBiz.bizThumbPath) {
            setFix(true); // 서버에 저장된 대표 사진이 있으면 수정 불가로 처리
        }
        */
        
        }
    }, [prevDonateBiz, prevBizPlanList, orgNo]);

    

    //수정한 기부 사업 내용
    const [donateBiz, setDonateBiz] = useState({
        bizNo : bizNo,             //사업 번호
        orgNo : orgNo,          //단체 번호
        donateCode : "",        //기부 코드
        bizName : "",           //사업명
        bizContent : "",        //사업 내용
        bizStart : "",          //사업 시작 날짜
        bizEnd : "",            //사업 종료 날짜
        bizGoal : 0,            //목표 후원 금액
        bizDonateTerm : "",     //모금 기간
        bizPlanList : [{}],        //모금액 사용 계획
        bizThumbPath : "" ,          // 썸네일 이미지
        bizDonateStart : "" ,    // 모금 시작일
        bizDonateEnd : "",       // 모금 종료일
        deletedPlanNos: []       // 삭제된 모금액 사용 계획번호 (숫자 배열)
    });

    //수정한(추가된) 모금액 사용 계획
    const [bizPlanList, setBizPlanList] = useState([{
        bizNo : bizNo,          // 사업번호
        bizPlanPurpose : "",    //사용 용도 및 산출 근거
        bizPlanMoney : ""      //금액
    }]);

    // bizContent 수정
    useEffect(function () {
        if (editorRef.current && donateBiz.bizContent) {
            editorRef.current.getInstance().setHTML(donateBiz.bizContent);
        }
    }, [donateBiz.bizContent]); // 변경될 때마다 반영

    //사업 시작 날짜가 최소 7일 뒤에 시작되어야 해 확인하기 위하여
    const today = new Date();
    //7일 뒤 날짜 가져오기
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    //0000-00-00 형식으로 바꿔주기
    const year = nextWeek.getFullYear();
    const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
    const day = String(nextWeek.getDate()).padStart(2, '0');
    const nextWeekStr = year + "-" + month + "-" + day;

    //사업 시작 날짜, 사업 종료 날짜, 사업명 변경 시 onChange 호출
    function chgBiz(e){
        donateBiz[e.target.id] = e.target.value;

        if(e.target.id == "bizStart"){
            if(e.target.value < nextWeekStr){
                Swal.fire({
                    title : "알림",
                    text : "사업 시작일은 7일 뒤부터 가능합니다.",
                    icon : "warning",
                    confirmButtonText : "확인"
                }).then(function(result){
                    e.target.value = "";
                });
            }else if(donateBiz.bizEnd != "" && e.target.value > donateBiz.bizEnd){
                Swal.fire({
                    title : "알림",
                    text : "사업 종료일은 사업 시작일보다 빠를 수 없습니다.",
                    icon : "warning",
                    confirmButtonText : "확인"
                }).then(function(result){
                    e.target.value = "";
                })
            }else{
                setDonateBiz({...donateBiz});
            }
        }

        if(e.target.id == "bizEnd" && donateBiz.bizStart != "" && e.target.value < donateBiz.bizStart){
            Swal.fire({
                title : "알림",
                text : "사업 종료일은 사업 시작일보다 빠를 수 없습니다.",
                icon : "warning",
                confirmButtonText : "확인"
            }).then(function(result){
                e.target.value = "";
            })
        }else{
            setDonateBiz({...donateBiz});
        }
    }

    //사용 계획 추가 클릭 시 호출 함수
    function addBizPlan(){
        const newBizPlan = {bizNo : bizNo, bizPlanPurpose : "", bizPlanMoney : ""};
        setBizPlanList([...bizPlanList, newBizPlan]);
    }

    // 사용 계획 삭제 시 호출 함수
    function deleteBizPlan(index) {
    const deletedPlan = bizPlanList[index];

    // 삭제 대상에 planNo가 있을 경우에만 삭제 목록에 추가
    if (deletedPlan.planNo) {
        console.log("deletedPlan.planNo : ", deletedPlan.planNo) // 나옴
        
        setDonateBiz(prev => ({
            ...prev,
            deletedPlanNos: [...(prev.deletedPlanNos || []), deletedPlan.planNo]
            }));
    }

    // planList에서 해당 항목 제거
    const updatedPlans = bizPlanList.filter((_, i) => i !== index);
    setBizPlanList(updatedPlans);
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

    const thumbImg = useRef(null);
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

    /*
    //대표 사진 변경 가능 여부를 다룰 변수
    const [fix, setFix] = useState(false);
    */

    
    useEffect(function(){
        setDonateBiz({...donateBiz, bizPlanList : bizPlanList});
    }, [bizPlanList]);
    
    //등록 버튼 클릭 시 실행 함수
    function insertBizPlan(){
        //콤마 제거를 위해
        const cleanedDonateBiz = Object.assign({}, donateBiz);

        // bizPlanList 내 각 항목의 bizPlanMoney 콤마 제거
        cleanedDonateBiz.bizPlanList = cleanedDonateBiz.bizPlanList.map(function (plan) {
            return Object.assign({}, plan, {
            bizPlanMoney: String(plan.bizPlanMoney).replace(/,/g, "")
            });
        });

        //유효성 체크
        //유효성 조건 리스트
        const validations = [
            { valid: donateBiz.bizStart == "", message: "사업 시작일을 선택하세요." },
            { valid: donateBiz.bizEnd == "", message: "사업 종료일을 선택하세요." },
            { valid: donateBiz.bizGoal == 0, message: "사용 용도 및 산출 근거 또는 사용 금액을 입력하세요." },
            { valid: donateBiz.bizGoal >= 1000000000, message: "전체 목표 금액은 10억 미만으로 설정해주세요." },
            { valid: donateBiz.donateCode == "", message: "기부 코드를 선택하세요." },
            { valid: donateBiz.bizName == "", message: "사업명을 입력하세요." },
            { valid: donateBiz.bizContent == "", message: "사업 내용을 입력하세요." },
            { valid: !bizImg && !donateBiz.bizThumbPath, message: "대표 사진을 등록해주세요." }
        ];
    
        //검증 실패 시 첫 번째 오류 메시지 띄우고 return
        for (let i = 0; i < validations.length; i++) {
            if (validations[i].valid) {
                Swal.fire({
                    title: "알림",
                    text: validations[i].message,
                    icon: "warning",
                    confirmButtonText: "확인"
                });
                return;
            }
        }

        //사용 계획 미입력 시 메시지
        for(let i=0; i<bizPlanList.length; i++){
            if(bizPlanList[i].bizPlanPurpose == ""){
                Swal.fire({
                    title : "알림",
                    text : "사용 용도 및 산출 근거를 입력하세요.",
                    icon : "warning",
                    confirmButtonText : "확인"
                });
                return;
            }else if(bizPlanList[i].bizPlanMoney == 0 || bizPlanList[i].bizPlanMoney == ""){
                Swal.fire({
                    title : "알림",
                    text : "사용 금액을 입력하세요.",
                    icon : "warning",
                    confirmButtonText : "확인"
                });         
                return;       
            }
        }

        Swal.fire({
            title : "알림",
            text : "사업신청후 7일 경과 후에도 승인처리 되지 않은 경우 자동 반려처리됩니다. (7일의 기준은 25-06-20 오후 3:00에 신청 시 마감 시한은 25-6-27 23:59)",
            icon : "warning",
            showCancelButton : true,
            confirmButtonText : "확인",
            cancelButtonText : "취소"
        })
        .then(function(result){
            if(result.isConfirmed){
                const cleanedDonateBiz = {
                    ...donateBiz,
                    bizPlanList: donateBiz.bizPlanList.map(plan => ({
                        ...plan,
                        bizNo: donateBiz.bizNo
                    }))
                };


                let options = {};
                options.url = serverUrl + "/biz/update";
                options.method = "patch";
                options.data = cleanedDonateBiz
                console.log("donateBiz : " , donateBiz);
        
                
                axiosInstance(options)
                .then(function(res){

                    // DB에 tbl_donate_biz 업데이트 성공일 경우
                    // 여기에 사진 /biz/thumb 하는 axios 선언

                    //DB에 대표 사진 저장
                    const form = new FormData();
                    
                    // 새로 올린 이미지가 있을 때만 해당 axios 실행
                    if(bizImg != null){
                        form.append("bizImg", bizImg);
                        form.append("bizNo", bizNo);
                        console.log("bizImg : ", bizImg);
                        console.log("bizNo : ", bizNo);
    
                        let options = {};
                        options.url = serverUrl + "/biz/thumb";
                        options.method = "post";
                        options.data = form;
                        options.headers = {};
                        options.headers.contentType = "multipart/form-data";
                        options.headers.processData = false; //쿼리스트링 X
                        
                        
                        axiosInstance(options)
                        .then(function(res){
                            
                            /*
                            const newDonateBiz = res.data.resData;

                            setDonateBiz(prev => ({
                                ...prev,
                                bizNo: newDonateBiz.bizNo,
                                bizThumbPath: newDonateBiz.bizThumbPath // 서버에서 전달받은 새 썸네일 경로로 갱신
                            }));
                            */
                            
                            
                            Swal.fire({
                                title : "알림",
                                text : res.data.clientMsg,
                                icon : res.data.alertIcon,
                                confirmButtonText : "확인"
                            })
                            .then(function(result){
                                
                                    navigate("/biz/view/"+bizNo);
                            });
                        });
                        
                    }else{
                        // bizImg 가 없는 경우 : 이미지 수정 없이 사업 정보가 수정 완료 처리됨
                        Swal.fire({
                                title : "알림",
                                text : res.data.clientMsg,
                                icon : res.data.alertIcon,
                                confirmButtonText : "확인"
                            })
                            .then(function(result){
                                
                                    navigate("/biz/view/"+bizNo);
                            });

                    }
                });
            }
        })
    }
    /*
    // 썸네일 함수 초기화
    function resetThumbImage() {
        //setFix(false); // 다시 수정 가능 상태로 전환
        setBizImg(null); // 서버로 전송할 이미지 초기화
        setBizThumbImg(null); // 미리보기 이미지 제거
        // 기존 donateBiz의 bizThumbPath 제거 (원하면)
        setDonateBiz(prev => ({
            ...prev,
            bizThumbPath: ""  // or null
        }));
    }
    */
    /*

    //대표 사진 확정 버튼 클릭 시 호출 함수
        function fixThumbImg(){
            Swal.fire({
                title : "알림",
                text : "확정 시 대표 사진 이미지는 변경하지 못합니다.",
                icon : "warning",
                showCancelButton : true,
                cancelButtonText : "취소",
                confirmButtonText : "확정"
            }).then(function(result){
                if(result.isConfirmed){ //확정 버튼 클릭 시 
                    //대표 사진 변경 못하게 변수 변경
                    setFix(true);
                    
                    //DB에 대표 사진 저장
                    const form = new FormData();
    
                    if(bizImg != null){
                        form.append("bizImg", bizImg);
                        form.append("orgNo", orgNo);
    
                        let options = {};
                        options.url = serverUrl + "/biz/thumb";
                        options.method = "post";
                        options.data = form;
                        options.headers = {};
                        options.headers.contentType = "multipart/form-data";
                        options.headers.processData = false; //쿼리스트링 X
                        
                        axiosInstance(options)
                        .then(function(res){
                            const newDonateBiz = res.data.resData;

                            setDonateBiz(prev => ({
                                ...prev,
                                bizNo: newDonateBiz.bizNo,
                                bizThumbPath: newDonateBiz.bizThumbPath // 서버에서 전달받은 새 썸네일 경로로 갱신
                            }));
                        });
                    }
                };
            });
        }
            */


    return(
       <div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                insertBizPlan();//등록 버튼 클릭 시 실행 함수
            }}>
                <div>
                    <div>희망 모금 기간</div>
                    <div className="biz-start">
                            <span>{donateBiz.bizDonateStart} ~ {donateBiz.bizDonateEnd}</span>
                        </div>
                </div>
                <div>
                    <div>사업 기간</div>
                    <div style={{display : "flex"}}>
                        <div className="biz-start">
                            <div>시작일</div>
                            <input type="date" id="bizStart" value={donateBiz.bizStart} onChange={chgBiz}/> ~ &nbsp;
                        </div>
                        <div className="biz-end">
                            <div>종료일</div>
                            <input type="date" id="bizEnd" value={donateBiz.bizEnd} onChange={chgBiz}/>
                        </div>
                    </div>
                </div>
                <div>
                    <div>모금액 사용 계획</div>
                    <div>
                        {bizPlanList.map(function(bizPlan, index){
                            return  <BizPlan key={"bizPlan"+index} bizPlan={bizPlan} index={index} bizPlanList={bizPlanList} setBizPlanList={setBizPlanList}
                                            donateBiz={donateBiz} setDonateBiz={setDonateBiz} onDeletePlan={deleteBizPlan}/>
                        })}
                        <button type="button" onClick={addBizPlan}>사용 계획 추가</button>
                    </div>
                    <span>목표 금액 : {(donateBiz.bizGoal || 0).toLocaleString("ko-KR")}원</span>
                </div>
                <div>
                    <div>기부 카테고리 선택</div>
                    <FormControl>
                        <RadioGroup row name="biz-donate-date" 
                                    value={donateBiz.donateCode} 
                                    onChange={selectDonateCtg}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                        >
                            {donateCtgList.map(function(category, index){
                                return <FormControlLabel key={"category"+index} value={category.donateCode} control={<Radio />} label={category.donateCtg}
                                        vlaue={donateBiz.donateCode}/>
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
                    <img 
                        src={
                            bizThumbImg
                            ? bizThumbImg
                            : donateBiz.bizThumbPath
                            ? serverUrl + "/biz/thumb/" + donateBiz.bizThumbPath.substring(0,8) + "/" + donateBiz.bizThumbPath
                            : "/images/default_img.png"
                        }
                        style={{ width: "100px", cursor: "pointer" }}
                        onClick={() => thumbImg.current.click()}
                    />
                    <input type="file" id="bizThumbPath" style={{display : "none"}} onChange={chgBizThumb} ref={thumbImg}/>

                    {/*<button type="button" onClick={resetThumbImage}>사진초기화</button>
                    <div>
                        <Button variant="contained" type="button" style={{bottom : "0", marginTop : "65px", marginLeft : "10px"}}>확정</Button>
                    </div>
                    */}
                </div>
                <div>
                    <div>본문</div>
                    <div>
                        {/*news 폴더 안에 있는 ToastEditor 재사용*/}
                        <ToastEditor donateBiz={donateBiz} setDonateBiz={setDonateBiz} type={1}/>
                    </div>
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
    const onDeletePlan = props.onDeletePlan;

    //입력 시 호출 함수
    function chgBizPlan(e) {
        const { name, value } = e.target;

        //기존 배열 복사
        const newBizPlanList = [...bizPlanList];

        let newValue = value;
        if(name == "bizPlanMoney"){
            newValue = Number(value);

            if(isNaN(newValue)){
                Swal.fire({
                    title : "알림",
                    text : "숫자만 입력해주세요.",
                    icon : "warning",
                    confirmButtonText : "확인"
                })
                .then(function(res){
                    newValue = 0;
                });
            }
        }

        //해당 인덱스의 항목만 변경
        newBizPlanList[index] = {...newBizPlanList[index], [name]: newValue};

        setBizPlanList(newBizPlanList);

        //합계 계산
        let total = 0;
        for (let i=0; i < newBizPlanList.length; i++) {
            const money = Number(newBizPlanList[i].bizPlanMoney);
            total += isNaN(money) ? 0 : money;
        }

        setDonateBiz({ ...donateBiz, bizGoal: total });
    }

    return(
        <div name="div-bizPlan">
            <input type="text" name="bizPlanPurpose" placeholder="사용 용도 및 산출 근거" value={bizPlan.bizPlanPurpose} onChange={chgBizPlan}/>
            <input type="text" name="bizPlanMoney" placeholder="금액" value={isNaN(bizPlan.bizPlanMoney) ? "" : bizPlan.bizPlanMoney} onChange={chgBizPlan}/>
            {index !== 0 && (
                 <span
                    onClick={() => onDeletePlan(index)}
                    style={{ 
                        marginLeft: "8px", 
                        cursor: "pointer", 
                        color: "red", 
                        fontWeight: "bold" 
                    }}
                >
                    ⛔
                </span>
            )}
        </div>
    );
}