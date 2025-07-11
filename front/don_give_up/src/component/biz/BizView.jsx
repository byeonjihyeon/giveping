import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Survey from './Survey';
import BizFile from './BizFile';
import Swal from "sweetalert2";
import { green } from "@mui/material/colors";

export default function BizView(){
    const {loginMember, loginOrg, isLogined} = useUserStore();
    const param = useParams();
    const bizNo = param.bizNo;
    //console.log(bizNo);

    const [searchParams] = useSearchParams();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [donateBiz, setDonateBiz] = useState({});

    // memberList 저장 변수
    const [memberList, setMemberList] = useState([]);

    // planList 저장 변수 (모금액 사용 계획)
    const [planList, setPlanList] = useState([]);

    // 기부 팝업 모달을 위한 변수 선언
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    // 기부하기 팝업 모달을 위한 변수 선언
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    // 관리자 전용 버튼 가시화 위한 변수 선언
    const [showMemberList, setShowMemberList] = useState(false);

    const [bizFile, setBizFile] = useState([]); // 게시글에 대한 첨부파일 객체
    const [prevBizFileList, setPrevBizFileList] = useState([]); //BizFile 객체 리스트 
    const [delBizFileNo, setDelBizFileNo] = useState([]); //삭제 대상 파일 번호 저장 배열

    // 날짜 계산 후, 글삭제 버튼 가시화하기 위해 변수 선언
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bizEndDate = new Date(donateBiz.bizEnd);
    bizEndDate.setHours(0, 0, 0, 0);

    const isOwnerOrAdmin = 
    (loginMember != null && loginMember.memberLevel === 1) || 
    (loginOrg != null && loginOrg.orgNo === donateBiz.orgNo);


    
    function openDonatePopup() {
        //console.log("기부하기 버튼 클릭");
        if(loginOrg && loginOrg.orgNo === donateBiz.orgNo){
            Swal.fire({
                        title : '알림',
                        text : '같은 단체의 사업에 기부할 수 없습니다.',
                        icon : 'warning',
                        showCancelButton : false,
                        confirmButtonText : '확인'
                    });
                    return; 
                    
            /*
            alert("같은 단체의 사업에 기부할 수 없습니다.");
            return;
            */
        }else{
            setIsDonateOpen(true);
        }
    }

    function openSurveyPopup() {
        //console.log("설문조사 버튼 클릭");
        setIsSurveyOpen(true);
    }

    function closeSurveyPopup() {
        setIsSurveyOpen(false);
    }

    function closeDonatePopup() {
        setIsDonateOpen(false);
    }


    // 기부 사업 내용 불러오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/biz/' + bizNo;
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            console.log("후원회원", res.data.resData.bizMemberList);
            setDonateBiz(res.data.resData);
            setMemberList(res.data.resData.bizMemberList);
            setPlanList(res.data.resData.bizPlanList);
            console.log(res.data.resData.bizPlanList);
            //doanteBiz 안에 있는 bizMemberList에는 member 객체가 여러 개 들어있음
        });

    }, [bizNo]);

    // 쿼리 파라미터 survey=open 인지 감지해서 설문조사 팝업 자동 열기
    useEffect(() => {
        if(searchParams.get('survey') === 'open'){
            setIsSurveyOpen(true);
        }
    }, [searchParams]);

    useEffect(function () {
        if (donateBiz.fileList && Array.isArray(donateBiz.fileList)) {
            setPrevBizFileList(donateBiz.fileList);
        }
    }, [donateBiz.fileList]);


/*
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/biz/file/' + bizNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //console.log(res.data.resData);
            setPrevBizFileList(res.data.resData);
            //doanteBiz 안에 있는 bizMemberList에는 member 객체가 여러 개 들어있음
        });
        console.log("삭제 대상 파일 번호 배열 변경됨:", delBizFileNo);
    }, []);
    */

    const navigate = useNavigate();
    // 삭제하기 클릭 시, 동작 함수
        function deleteBiz(){
            Swal.fire({
                title : '알림',
                text : '기부 사업글을 삭제 하시겠습니까?',
                icon : 'question',
                showCancelButton : true,
                confirmButtonText : '삭제',
                cancelButtonText : '취소'
            }).then(function(res){
                if(res.isConfirmed){
                /*
                    let options = {};
                    options.url = serverUrl + '/biz/delete/' + donateBiz.bizNo;
                    options.method = 'patch';
        
                    axiosInstance(options)
                    .then(function(res){
                        console.log(res.data.resData);
                        if(res.data.resData){
                            navigate('/biz/list');
                        }
                    });
                    */
                }
                }
        )};

        // 탭 변환
        const [activeTab, setActiveTab] = useState('intro');
        console.log("loginMember : ", loginMember);

        function renderTab(){
            switch(activeTab){
                case 'intro' : 
                    return <IntroTab donateBiz={donateBiz}/>;
                case 'plan' : 
                    return <PlanTab planList={planList} donateBiz={donateBiz}/>;
                case 'file' : 
                    return <FileTab loginMember={loginMember} loginOrg={loginOrg} bizNo={bizNo}
                                    prevBizFileList={prevBizFileList} setPrevBizFileList={setPrevBizFileList}
                                    donateBiz={donateBiz} bizFile={bizFile} setBizFile={setBizFile}
                                    delBizFileNo={delBizFileNo} setDelBizFileNo={setDelBizFileNo}/>;
                case 'donateMember' : 
                    return <DonateMember showMemberList={showMemberList} setShowMemberList={setShowMemberList} memberList={memberList}/>;
                default :
                    return null;
            }
        };

        // span 태그 클릭 시 호출되는 함수
        function handleTabClick(tabName) {
            setActiveTab(tabName);
        }


    

    return (
        <section>
            {/* 썸네일, 디데이, 제목, 모금율 그래프 */}
           <div className="bizView-banner-wrap">
                <div className="bizView-banner-info">
                    <span className="bizView-banner-day">D-34</span>
                    <br/>
                    <strong>{donateBiz.bizName}</strong>
                </div>
           </div>

           {/* 고정 메뉴 - 기부소개 / 사용계획 / 소식후기 / 기부회원리스트 / 기부하기 => 관리자나 기부단체계정일 경우 글수정,글삭제 버튼으로 */}
           <div className="tabArea-wrap">
                {/* 왼쪽에 위치 */}
                <div className="tabArea-left">
                    <span className={ "tabArea-left-text" + (activeTab === 'intro' ? " active" : "") } 
                          onClick={function(){handleTabClick('intro');}}>기부소개</span>
                    <span className={ "tabArea-left-text" + (activeTab === 'plan' ? " active" : "") } 
                          onClick={function(){handleTabClick('plan');}}>사용계획</span>
                    <span className={ "tabArea-left-text" + (activeTab === 'file' ? " active" : "") }
                          onClick={function(){handleTabClick('file');}}>소식후기</span>
                    {/* 관리자나 기부단체계정일 경우에만 보임 */}
                    <span className={ "tabArea-left-text" + (activeTab === 'donateMember' ? " active" : "") } 
                          onClick={function(){handleTabClick('donateMember');}}>기부회원리스트</span>
                </div>
                {/* 오른쪽에 위치 */}
                <div className="tabArea-right">
                    <span className="tabArea-right-text" onClick={openDonatePopup}>기부하기</span>
                    {/* 기부 팝업 */}
                    {isDonateOpen && <Donate onClose={closeDonatePopup} donateBiz={donateBiz} />}
                    {/* 관리자나 기부단체계정일 경우에만 보임 */}
                    <span className="tabArea-right-text" onClick={function(){navigate("/biz/update/" + donateBiz.bizNo)}}>수정</span>
                    <span className="tabArea-right-text" onClick={deleteBiz}>삭제</span>
                </div>
           </div>
            {/* 콘텐츠 (tabArea-wrap 하단에 위치) */}
           <div className="bizView-content-wrap">
                <div className="bizView-inner-content">
                    {/* aside-content-wrap의 왼쪽에 위치 */}
                    <div className="main-content-wrap">
                         {renderTab()}
                        
                    </div>
                    {/* main-content-wrap의 오른쪽에 위치 */}
                    <div className="aside-content-wrap">
                        <div className="content-orgInfo-wrap">
                            <span className="content-orgInfo">모금단체</span>
                            {/* Link url 임시 설정 => "/org/view/"+orgNo  로 변경할것임.*/}
                            <Link className="content-orgInfo-link" to={"/biz/view/"+bizNo}>
                                <span className="content-orgInfo-img" src={"/images/default_img.png"}></span>
                                <span className="content-orgInfo-name">{donateBiz.orgName}</span>
                            </Link>
                        </div>
                    </div>
                </div>
           </div>
        </section>
    );
}

// 기부소개 탭 컴포넌트 
function IntroTab(props){
    const donateBiz = props.donateBiz;

    return(
        <div className="content-tag-wrap">
            <div className="content-tag-wrap">
                <span className="content-tag">#{donateBiz.donateCtg}</span>
            </div>
            <div className="content-bizContent">
                {
                    donateBiz.bizContent
                    ? <Viewer initialValue={donateBiz.bizContent} />
                    : ''
                }
            </div>
        </div>
    );
}

// 사용계획 탭 컴포넌트
function PlanTab(props){
    const planList = props.planList;
    const donateBiz = props.donateBiz;

    return(
        <div className="content-plan-wrap">
            <strong className="content-plan-title">이렇게 진행됩니다.</strong>
            <ul className="content-plan-info">
                <li className="">
                    <span>모금 기간</span>
                    <span>{donateBiz.bizDonateStart} ~ {donateBiz.bizDonateEnd}</span>
                </li>
                <li className="">
                    <span>사업 기간</span>
                    <span>{donateBiz.bizStart} ~ {donateBiz.bizEnd}</span>
                </li>
            </ul>
            <div className="donate-plan-list">
                {/* 목표금액 표시 */}
                <div className="donate-plan-goal">
                    <span>목표금액</span>
                    <span>{donateBiz?.bizGoal != null ? donateBiz.bizGoal.toLocaleString() + '원' : '-'}</span>
                </div>

                {/* 용도별 사용계획 */}
                {planList.map((plan, index) => (
                    <div key={plan.planNo}>
                        <span>{plan.bizPlanPurpose}</span>
                        <span>{plan.bizPlanMoney.toLocaleString()}원</span>
                    </div>
                ))}
            </div>
        </div>
    );

}

// 소식후기 탭 컴포넌트
function FileTab(props){
    const loginMember = props.loginMember;
    const loginOrg = props.loginOrg;
    const bizNo = props.bizNo;
    const prevBizFileList = props.prevBizFileList;
    const setPrevBizFileList = props.setPrevBizFileList;
    const donateBiz = props.donateBiz;
    const bizFile = props.bizFile;
    const setBizFile = props.setBizFile;
    const setDelBizFileNo = props.setDelBizFileNo;
    const delBizFileNo = props.delBizFileNo;

    return(
        <div className="content-file-wrap">
            <BizFile loginMember={loginMember}
                     loginOrg={loginOrg}
                     bizFile={bizFile}
                     setBizFile={setBizFile}
                     prevBizFileList={prevBizFileList}
                     setPrevBizFileList={setPrevBizFileList}
                     delBizFileNo={delBizFileNo}
                     setDelBizFileNo={setDelBizFileNo}
                     donateBiz={donateBiz}
                     bizNo={bizNo}
                     />

        </div>
    );

}

// 기부회원리스트 탭 컴포넌트
function DonateMember(props){
    const showMemberList = props.showMemberList;
    const setShowMemberList = props.setShowMemberList;
    const memberList = props.memberList;

    return(

        <div className="content-donateMember-wrap">
            <div className="donateMember-zone">
                {/* 기부한 회원 리스트 (관리자 전용) */}
                <p className="donateMember-title">기부 회원 리스트</p>
                
                <button onClick={() => setShowMemberList(!showMemberList)}>
                    {showMemberList ? '기부자 목록 숨기기' : '기부자 목록 보기'}
                </button>

                {
                    showMemberList && memberList
                    ? memberList.map((member, index) => (
                        <MemberItem key={"member" + index} member={member} />
                    ))
                    : null
                }
            </div>
        </div>
    );

}


// 멤버 1명 객체
function MemberItem(props){
    const member = props.member;

    return(
        <div className="member-card">
            <div className="member-row">
                <div className="member-label">아이디</div>
                <div className="member-value">{member.memberId}</div>
                <div className="member-label">이름</div>
                <div className="member-value">{member.memberName}</div>
            </div>
            <div className="member-row">
                <div className="member-label">생년월일</div>
                <div className="member-value">{member.memberBirth}</div>
                <div className="member-label">전화번호</div>
                <div className="member-value">{member.memberPhone}</div>
            </div>
            <div className="member-row">
                <div className="member-label">기부금액</div>
                <div className="member-value">{member.donateMoney}원</div>
                <div className="member-label">기부일시</div>
                <div className="member-value">{member.donateDate}</div>
            </div>
            <hr />
            <br />
        </div>
    );

}

function Donate(props){
    const onClose = props.onClose;
    const donateBiz = props.donateBiz;

    //스토리지에 저장한 데이터 추출하기
    const {loginMember} = useUserStore();
    console.log(loginMember.memberName);
    const memberNo = loginMember.memberNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    // 회원 예치금 저장 변수
    const [totalMoney, setTotalMoney] = useState(0);

    const [selectedAmount, setSelectedAmount] = useState(0);
    const [customInputVisible, setCustomInputVisible] = useState(false);
    const [customAmount, setCustomAmount] = useState("");

    // 기부 결제 정보 저장 변수
    const [payInfo, setPayInfo] = useState({
        bizNo : donateBiz.bizNo,
        memberNo : loginMember.memberNo,
        donateMoney : selectedAmount
    });

    
    // 기부 금액 선택 핸들러
    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomInputVisible(false);
        setCustomAmount("");
    };

    // 직접 입력 선택 시 핸들러
    const handleCustomClick = () => {
        setSelectedAmount(0);
        setCustomInputVisible(true);
    };

    // 입력값 변경 핸들러
    const handleCustomAmountChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setCustomAmount(e.target.value);
        setSelectedAmount(value);
    };

    // 회원 번호로 회원 예치금 찾아오기
    useEffect(function(){
        let options={};
        options.url = serverUrl + "/biz/donate/" + memberNo;
        options.method="get";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData.totalMoney);
            setTotalMoney(res.data.resData.totalMoney); // 멤버별 잔여 예치금 저장
        });
    }, []);

    // 결제 버튼 클릭 시 호출되는 함수
    async function donatePay(){
        // 잔여 예치금 - 결제 금액이 마이너스인 경우, 결제 못함
        if (totalMoney <= 0 || totalMoney - selectedAmount < 0) {
            await Swal.fire({
                        title : '알림',
                        text : '잔액이 부족합니다. 예치금을 충전해주세요.',
                        icon : 'warning',
                        showCancelButton : false,
                        confirmButtonText : '확인'
                    });
                    navigate("/member");    // 충전하기 위해 /member 로 이동
                    return; 
                    }

    // 기부 정보 객체 재구성
    const updatedPayInfo = {
        ...payInfo,
        donateMoney: selectedAmount
    };

        let options={};
        options.url = serverUrl + "/biz/donate";
        options.data = updatedPayInfo;
        options.method="post";
        console.log(updatedPayInfo);
        
        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            if(res.data.resData){
                //성공할 경우, 팝업 닫음
                onClose();
            }
        });
        
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>기부하기</h3>
                <div style={{ margin: "15px 0" }}>
                    <p><strong>기부 금액 선택</strong></p>
                    <div className="button-group">
                        {[3000, 5000, 10000, 30000, 50000].map((amount) => (
                            <button
                                key={amount}
                                onClick={() => handleAmountClick(amount)}
                                className={selectedAmount === amount ? "selected" : ""}
                            >
                                {amount.toLocaleString()}원
                            </button>
                        ))}
                        <button
                            onClick={handleCustomClick}
                            className={customInputVisible ? "selected" : ""}
                        >
                            직접입력
                        </button>
                    </div>
                    {customInputVisible && (
                        <input
                            type="number"
                            placeholder="기부 금액 입력"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                        />
                    )}
                </div>

                {selectedAmount > 0 && (
                    <div>
                        <p><strong>기부 금액:</strong> {selectedAmount.toLocaleString()}원</p>
                        <p><strong>나의 예치금 잔액:</strong> {totalMoney.toLocaleString()}원</p>
                        <p><strong>차감 후 잔액:</strong> {(totalMoney - selectedAmount).toLocaleString()}원</p>
                    </div>
                )}
                <div style={{ textAlign: "right", marginTop: "16px" }}>
                <button onClick={donatePay} disabled={selectedAmount <= 0}>결제하기</button>
                <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}