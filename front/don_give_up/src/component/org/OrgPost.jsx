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


//기부 사업 등록
export default function OrgPost(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    
    const {loginOrg} = useUserStore();

    //기부 사업 내용
    const [donateBiz, setDonateBiz] = useState({
        bizNo : 0,             //사업 번호
        orgNo : loginOrg.orgNo, //단체 번호
        donateCode : "",        //기부 코드
        bizName : "",           //사업명
        bizContent : "",        //사업 내용
        bizStart : "",          //사업 시작 날짜
        bizEnd : "",            //사업 종료 날짜
        bizGoal : 0,            //목표 후원 금액
        bizDonateTerm : "",     //모금 기간
        bizPlanList : [{}]        //모금액 사용 계획
    });

    //모금액 사용 계획
    const [bizPlanList, setBizPlanList] = useState([{
        bizPlanPurpose : "",    //사용 용도 및 산출 근거
        bizPlanMoney : ""      //금액
    }]);

    //모금 기간 선택 시 호출 함수
    function selectDonateDate(e){
        const donateTerm = e.target.value;
        setDonateBiz({...donateBiz, bizDonateTerm : donateTerm});
    }

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

    //대표 사진 변경 가능 여부를 다룰 변수
    const [fix, setFix] = useState(false);

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
                    form.append("orgNo", loginOrg.orgNo);

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
                        setDonateBiz({...donateBiz, bizNo : newDonateBiz.bizNo});
                    })
                }
            };
        });
    }

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
            { valid: donateBiz.bizDonateTerm == "" || donateBiz.bizDonateTerm == 0, message: "모금 기간을 선택하세요." },
            { valid: donateBiz.bizStart == "", message: "사업 시작일을 선택하세요." },
            { valid: donateBiz.bizEnd == "", message: "사업 종료일을 선택하세요." },
            { valid: donateBiz.bizGoal == 0, message: "사용 용도 및 산출 근거 또는 사용 금액을 입력하세요." },
            { valid: donateBiz.bizGoal >= 1000000000, message: "전체 목표 금액은 10억 미만으로 설정해주세요." },
            { valid: donateBiz.donateCode == "", message: "기부 코드를 선택하세요." },
            { valid: donateBiz.bizName == "", message: "사업명을 입력하세요." },
            { valid: donateBiz.bizContent == "", message: "사업 내용을 입력하세요." },
            { valid: bizImg == null, message: "대표 사진 등록해주세요." },
            { valid: !fix, message: "대표 사진 확정 처리를 해주세요." }
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

        let options = {};
        options.url = serverUrl + "/biz/post";
        options.method = "patch";
        options.data = donateBiz

        axiosInstance(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            })
            .then(function(result){
                
            });
        });
    }

    return (
        <div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                insertBizPlan();//등록 버튼 클릭 시 실행 함수
            }}>
                <div>
                    <div>희망 모금 기간</div>
                    <div>*모금 시작일은 등록일로부터 7일 뒤입니다.(예시 : 등록일 - 7월 5일 / 모금 시작일 - 7월 12일)</div>
                    <FormControl>
                        <RadioGroup row name="biz-donate-date" onChange={selectDonateDate}
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
                    <span>목표 금액 : {(donateBiz.bizGoal || 0).toLocaleString("ko-KR")}원</span>
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
                    <img src={bizThumbImg ? bizThumbImg : "/images/default_img.png"} style={{width : "100px"}}
                        onClick={fix ? null : function(e){thumbImg.current.click();}}/>
                    <input type="file" id="bizThumbPath" style={{display : "none"}} onChange={chgBizThumb} ref={thumbImg}/>
                    <button type="button" onClick={fixThumbImg}>확정</button>
                </div>
                <div>
                    <div>본문</div>
                    <div>
                        {/*news 폴더 안에 있는 ToastEditor 재사용*/}
                        <ToastEditor donateBiz={donateBiz} setDonateBiz={setDonateBiz} type={0}/>
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
            <input type="text" name="bizPlanPurpose" placeholder="사용 용도 및 산출 근거" value={bizPlan.bizPlanPurpose} onChange={chgBizPlan}/>
            <input type="text" name="bizPlanMoney" placeholder="금액" value={isNaN(bizPlan.bizPlanMoney) ? "" : bizPlan.bizPlanMoney} onChange={chgBizPlan}/>
            {index != 0
            ?<span onClick={function(){deleteBizPlan(index)}} style={{cursor : "pointer"}}> ⛔</span>
            : ""}
        </div>
    )
}
