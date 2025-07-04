import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Survey from './Survey';
import BizFile from './BizFile';

export default function BizView(){
    const {loginMember} = useUserStore();
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

    //로그인 회원 정보 (수정, 삭제 버튼 활성화)
    //const {loginMember} = useUserStore(); 

    // 기부 팝업 모달을 위한 변수 선언
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    // 기부하기 팝업 모달을 위한 변수 선언
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    // 관리자 전용 버튼 가시화 위한 변수 선언
    const [showMemberList, setShowMemberList] = useState(false);

    const [bizFile, setBizFile] = useState([]); // 게시글에 대한 첨부파일 객체
    const [prevBizFileList, setPrevBizFileList] = useState([]); //BizFile 객체 리스트 
    const [delBizFileNo, setDelBizFileNo] = useState([]); //삭제 대상 파일 번호 저장 배열

    
    function openDonatePopup() {
        //console.log("기부하기 버튼 클릭");
        if(loginMember.orgNo == donateBiz.orgNo){
            alert("같은 단체의 사업에 기부할 수 없습니다.");
            return;
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
            //doanteBiz 안에 있는 bizMemberList에는 member 객체가 여러 개 들어있음
        });

    }, [bizNo]);

    // 쿼리 파라미터 survey=open 인지 감지해서 설문조사 팝업 자동 열기
    useEffect(() => {
        if(searchParams.get('survey') === 'open'){
            setIsSurveyOpen(true);
        }
    }, [searchParams]);

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

    const navigate = useNavigate();

    

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
                        {/* (기부단체는 본인 사업에 기부못함) 
                        loginMember.orgNo == donateBiz.orgNo인 경우 기부하기 버튼 보이지 않음 */}
                        {
                            loginMember != null && loginMember.memberNo != donateBiz.orgNo
                            ?
                                <button onClick={openDonatePopup}>기부하기</button>
                            :
                            ''
                        }
                        {/* 기부 팝업 */}
                        {isDonateOpen && <Donate onClose={closeDonatePopup} donateBiz={donateBiz} />}

                        {/* (설문조사 팝업 => 기부 이력 있는 회원만 버튼 보임)*/}
                        {/* 설문조사 팝업 */}
                        {isSurveyOpen && <Survey onClose={closeSurveyPopup} donateBiz={donateBiz} />}
                    </div>
                        
                        <BizFile loginMember={loginMember}
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
                    <br /> <hr />
                    {/* 관리자거나, 해당 기부 사업의 주체 단체일 경우에만 기부한 회원 리스트 버튼 생성 */}
                    {
                        loginMember != null && (loginMember.memberLevel == 1 || loginMember.orgNo ==  donateBiz.orgNo)
                        ?
                        <div className="donateMember-zone">
                            <p className="donateMember-title">기부한 회원 리스트 (관리자 전용)</p>
                            
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
                        :''
                    }
                   
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
    function donatePay(){
        // 잔여 예치금 - 결제 금액이 마이너스인 경우, 결제 못함
        if (totalMoney <= 0 || totalMoney - selectedAmount < 0) {
        alert("잔액이 부족합니다. 예치금을 충전해주세요.");
        // 이후 충전 페이지로 리다이렉션 돼야 함
        onClose();  // (test용)
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
                alert("기부 완료!");
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

                <button onClick={donatePay} disabled={selectedAmount <= 0}>결제하기</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}