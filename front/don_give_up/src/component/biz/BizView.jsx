import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Survey from './Survey';
import BizFile from './BizFile';
import Swal from "sweetalert2";
import { green, yellow } from "@mui/material/colors";

export default function BizView(){
    const {loginMember, loginOrg, isLogined} = useUserStore();
    const param = useParams();
    const bizNo = param.bizNo;

    const [searchParams] = useSearchParams();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

     console.log("BizView 렌더링 - 현재 bizNo:", bizNo); 

    // 카테고리별 기부 사업 리스트 선언
    const [bizCategoryList, setBizCategoryList] = useState([]);

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [donateBiz, setDonateBiz] = useState({});

    // memberList 저장 변수
    const [memberList, setMemberList] = useState([]);

    // planList 저장 변수 (모금액 사용 계획)
    const [planList, setPlanList] = useState([]);

    // 기부 팝업 모달을 위한 변수 선언
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    // 설문조사하기 팝업 모달을 위한 변수 선언
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    const isSurveyOpenUrl = searchParams.get("survey") === "open";

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
        if(loginOrg && loginOrg.orgNo === donateBiz.orgNo){
            Swal.fire({
                        title : '알림',
                        text : '같은 단체의 사업에 기부할 수 없습니다.',
                        icon : 'warning',
                        showCancelButton : false,
                        confirmButtonText : '확인'
                    });
                    return; 
                    
        }else{
            setIsDonateOpen(true);
        }
    }

    function openSurveyPopup() {
        setIsSurveyOpen(true);
    }

    function closeSurveyPopup() {
        setIsSurveyOpen(false);
    }

    function closeDonatePopup() {
        setIsDonateOpen(false);
    }

    // 카테고리별 기부 사업 불러오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/biz/donateCode/' + bizNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
        console.log("카테고리별 기부 사업 불러오기 : ", res.data.resData);
        setBizCategoryList(res.data.resData);
        });
    }, [bizNo])


    // 기부 사업 내용 불러오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/biz/' + bizNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setDonateBiz(res.data.resData);
            setMemberList(res.data.resData.bizMemberList);
            setPlanList(res.data.resData.bizPlanList);
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
                    let options = {};
                    options.url = serverUrl + '/biz/delete/' + donateBiz.bizNo;
                    options.method = 'patch';
        
                    axiosInstance(options)
                    .then(function(res){
                        if(res.data.resData){
                            navigate('/biz/list');
                        }
                    });
                }
                }
        )};

        // 탭 변환
        const [activeTab, setActiveTab] = useState('intro');

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

        // d-day 구하기
        function calculateDDay(donateEndDate) {
            const today = new Date();
            const endDate = new Date(donateEndDate);

            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                return "D-" + diffDays;
            } else if (diffDays === 0) {
                return "D-Day";
            } else {
                return "종료";
            }
        }

        // 기부금 달성률 계산
        const goal = donateBiz.bizGoal || 0;
        const donated = donateBiz.donateMoney || 0;
        const percent = goal > 0 ? Math.floor((donated / goal) * 100) : 0;

    return (
        <section>
            {/* 썸네일, 디데이, 제목, 모금율 그래프 */}    
            <div
                className="bizView-banner-wrap"
                style={{
                    backgroundImage: 'url(' + (
                    donateBiz.bizThumbPath
                        ? serverUrl + '/biz/thumb/' + donateBiz.bizThumbPath.substring(0, 8) + '/' +  donateBiz.bizThumbPath
                        : '/images/default_img.png'
                ) + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
                >
                <div className="bizView-banner-info">
                    <span className="bizView-banner-day">{calculateDDay(donateBiz.bizDonateEnd)}</span>
                    <br/>
                    <strong>{donateBiz.bizName}</strong>
                </div>

                <div className="bizView-progress-container">
                    <div className="bizView-progress-bar">
                            <div className="bizView-progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="bizView-donate-stats">
                        <span>{percent}%</span>
                        <span>{donated.toLocaleString()}원</span>
                    </div>
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
                    {
                        (loginOrg != null || loginMember != null) &&
                        (
                            (loginMember?.memberLevel === 1) ||
                            (loginOrg?.orgNo != null && donateBiz?.orgNo != null && loginOrg.orgNo === donateBiz.orgNo)
                        )
                        ? (
                            <span
                            className={"tabArea-left-text" + (activeTab === 'donateMember' ? " active" : "")}
                            onClick={() => handleTabClick('donateMember')}
                            >
                            기부회원
                            </span>
                        ) : ''
                    }
                </div>
                {/* 오른쪽에 위치 , 일반 회원일 경우에만 보임 (관리자, 기부 단체 계정은 x) */}
                <div className="tabArea-right">
                    {
                        loginMember != null && (loginMember.memberLevel == 2) && new Date(donateBiz.bizDonateEnd) > new Date()
                        ?
                        <span className="tabArea-right-text" onClick={openDonatePopup}>기부하기</span>
                        :''
                    }
                    {/* 기부 팝업 */}
                    {isDonateOpen && <Donate onClose={closeDonatePopup} donateBiz={donateBiz} />}
                    
                    {/* (설문조사 팝업 & 버튼 => 기부 이력 있는 회원만 버튼 보임)*/}
                    {/* 설문조사 버튼 : biz/view/2?survey=open 주소로 왔을 때만 보임 */}
                    {isSurveyOpenUrl ? <span className="tabArea-right-text" onClick={openSurveyPopup} style={{ backgroundColor: '#007BFF', color : '#ffffffff'}}>설문조사</span> : "" }

                        {/* 설문조사 팝업 */}
                        {isSurveyOpen && <Survey onClose={closeSurveyPopup} donateBiz={donateBiz} />}

                    {/* 관리자나 기부단체계정일 경우에만 보임 */}
                    {isOwnerOrAdmin && (
                        <>
                            {donateBiz.bizStatus !== 1 && (
                                <span
                                    className="tabArea-right-text"
                                    onClick={function(){ navigate("/biz/update/" + donateBiz.bizNo)}}
                                >
                                    수정
                                </span>
                            )}
                            {today >= bizEndDate && (
                                <span
                                    className="tabArea-right-text"
                                    onClick={deleteBiz}
                                >
                                    삭제
                                </span>
                            )}
                        </>
                    )}
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
                            <span className="content-orgInfo">후원단체</span>
                            {/* Link url 임시 설정 => "/org/view/"+orgNo  로 변경할것임.*/}
                            <Link className="content-orgInfo-link" to={"/organization/view/"+donateBiz.orgNo}>
                                <img className="content-orgInfo-img"
                                        src={donateBiz.orgThumbPath
                                        ? serverUrl + "/org/thumb/" + donateBiz.orgThumbPath.substring(0, 8) + "/" + donateBiz.orgThumbPath
                                        : "/images/default_img.png"}></img>
                                  <span className="content-orgInfo-text">
                                    <span className="content-orgInfo-name">{donateBiz.orgName}</span>
                                    <span className="content-orgInfo-introduce">{donateBiz.orgIntroduce}</span>
                                </span>
                            </Link>
                        </div>
                        {/* 카테고리별 기부사업 소개 (2개) */}
                        <div className="content-categoryInfo-wrap">
                            <div className="category-section-title">함께 보는
                                <span className="highlight-category-name"> #{donateBiz.donateCtg}</span> 기부 사업
                            </div>
                            <div className="category-items-container">
                                {/* bizCategoryList 에서 1개씩 꺼내오기 */}
                                {bizCategoryList?.map(function(bizCategory, index){
                                    return <CategoryItem key={"bizCategory" + index} bizCategory={bizCategory}/>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </section>
    );
}

function CategoryItem(props){
    const bizCategory = props.bizCategory;
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    // 기부금 달성률 계산
    const goal = bizCategory.bizGoal || 0;
    const donated = bizCategory.donateMoney || 0;
    const percent = goal > 0 ? Math.floor((donated / goal) * 100) : 0;

    return (
        <li className="category-item" onClick={function(){navigate('/biz/view/'+bizCategory.bizNo)}}>
            <div className="category-img">
                <img
                    src={bizCategory.bizThumbPath
                        ? serverUrl + "/biz/thumb/" + bizCategory.bizThumbPath.substring(0, 8) + "/" + bizCategory.bizThumbPath
                        : "/images/default_img.png"}
                />
            </div>
            <div className="category-info">
                <div className="category-title">{bizCategory.bizName}</div>
                <div className="category-sub-info">
                    <span>{bizCategory.orgName}</span>
                </div>
                <div className="category-progress-bar">
                        <div className="category-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="category-donate-stats">
                    <span>{percent}% </span>
                </div>
            </div>
        </li>
    );
}

// 기부소개 탭 컴포넌트 
function IntroTab(props){
    const donateBiz = props.donateBiz;

    return(
        <div className="content-tag-wrap">
            <span className="content-tag">#{donateBiz.donateCtg}</span>
            <div className="content-bizContent">
                {
                    donateBiz.bizContent
                    ? <Viewer key={donateBiz.bizNo} initialValue={donateBiz.bizContent} />
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
    const memberList = props.memberList;

    return (
         <div className="donate-member-list-wrap">
            <p className="donateMember-title">기부 회원 목록</p>
            {memberList && memberList.length > 0 ? (
                <div className="donate-member-list">
                    <div className="donate-member-header">
                        <div>아이디</div>
                        <div>이름</div>
                        <div>생년월일</div>
                        <div>전화번호</div>
                        <div>기부금액</div>
                        <div>기부일자</div>
                    </div>
                    {memberList.map((member, index) => (
                        <div className="donate-member-row" key={index}>
                            <div>{member.memberId}</div>
                            <div>{member.memberName}</div>
                            <div>{member.memberBirth}</div>
                            <div>{member.memberPhone}</div>
                            <div>{member.donateMoney.toLocaleString()}원</div>
                            <div>{member.donateDate}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>기부 회원이 없습니다.</p>
            )}
        </div>
        );
}


function Donate(props){
    const onClose = props.onClose;
    const donateBiz = props.donateBiz;

    //스토리지에 저장한 데이터 추출하기
    const {loginMember} = useUserStore();
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
                    }else{
                        Swal.fire({
                        title : '알림',
                        text : '기부 하시겠습니까?',
                        icon : 'question',
                        showCancelButton : true,
                        confirmButtonText : '확인',
                        cancelButtonText : '취소'
                    }).then(function(res){
                        // 기부 정보 객체 재구성
                        const updatedPayInfo = {
                            ...payInfo,
                            donateMoney: selectedAmount
                        };
                            if(res.isConfirmed){
                            let options={};
                            options.url = serverUrl + "/biz/donate";
                            options.data = updatedPayInfo;
                            options.method="post";
                            
                            axiosInstance(options)
                            .then(function(res){
                                if(res.data.resData){
                                    //성공할 경우, 팝업 닫음
                                    onClose();
                                }
                            });
                        }
                    })

                    }

    }

    return (
        <div className="modal-overlay">
            <div className="modal-contents">
                <h3 className="modal-title">기부하기</h3>

                <div className="modal-section">
                    <p className="section-title">기부 금액 선택</p>
                    <div className="amount-button-group">
                        {[3000, 5000, 10000, 30000, 50000].map((amount) => (
                            <button
                                key={amount}
                                onClick={function(){handleAmountClick(amount)}}
                                className={"amount-button" + (selectedAmount === amount ? " selected" : "")}
                            >
                                {amount.toLocaleString()}원
                            </button>
                        ))}
                        <button
                            onClick={handleCustomClick}
                            className={"amount-button" + (customInputVisible ? " selected" : "")}
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
                            className="custom-input"
                        />
                    )}
                </div>

                {selectedAmount > 0 && (
                    <div className="donation-receipt">
                        <div className="receipt-line">
                            <span className="label">나의 예치금 잔액</span>
                            <span className="value">{totalMoney.toLocaleString()}원</span>
                        </div>
                        <div className="receipt-line">
                            <span className="label">- 기부 금액</span>
                            <span className="value">{selectedAmount.toLocaleString()}원</span>
                        </div>
                        <div className="receipt-line total">
                            <span className="label">= 기부 후 잔액</span>
                            <span className="value">{(totalMoney - selectedAmount).toLocaleString()}원</span>
                        </div>
                    </div>
                )}

                <div className="modal-buttons">
                <button onClick={donatePay} disabled={selectedAmount <= 0} className="btn-primary">결제하기</button>
                <button onClick={onClose} className="btn-secondary" style={{height: '38px'}}>닫기</button>
                </div>
            </div>
        </div>
    );
}