import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Modal from "../common/Modal";


export default function MyHome(props){
    const {loginMember, loginOrg, unreadAlarmCount, setUnreadAlarmCount, setHasNewAlert} = useUserStore();
    const orgNo = loginOrg.orgNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [newsList, setNewsList] = useState([]);

    const [todayDonate, setTodayDonate] = useState(0);      //오늘 모인 기부금
    const [likeMember, setLikeMember] = useState(0);        //관심 회원 수
    const [categoryList, setCategoryList] = useState([]);   //주요 카테고리명
    const [bizList, setBizList] = useState([{}]);           //최근 사업 리스트
    const [reLoadOrg, setReLoadOrg] = useState({}); 
    console.log("MyHome에서 count : ", unreadAlarmCount);

    //알림 리스트 가져오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/org/alarm/' + orgNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            setNewsList(res.data.resData);
        });
    }, []);



    //메인에 출력될 정보 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/org/main/" + orgNo;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
            const main = res.data.resData;
            setTodayDonate(main.todayDonate);
            setLikeMember(main.likeMember);
            setCategoryList(main.categoryList);
            setBizList(main.bizList);
        });
    }, []);

    return(

        <div className="myNews-wrap">
                <div>
                    <span>Today 기부금 : {todayDonate} 원</span>
                </div>
                <div>
                    <span>관심 회원 수 : {likeMember} 명</span>
                </div>
                <div>
                    {categoryList.map(function(ctg, index){
                        return  <span key={"ctg"+index}>#{ctg}</span>
                    })}
                </div>
                <div className="myNews-title-wrap">
                    <span>내 소식</span>
                    <span> | 총 { unreadAlarmCount }  건</span>
                </div>
                <div className="myNews-item">
                    <div className="newsList-wrap" >
                             {
                                newsList.filter(news => news.alarmRead === 0).length === 0 ? (
                                <div>새로운 소식이 없습니다.</div>
                                ) : (
                                newsList
                                    .filter(news => news.alarmRead === 0)
                                    .slice(0, 3)
                                    .map(function(news, index) {
                                    return <News key={"news" + index} news={news} />;
                                    })
                                )
                            }
                    </div>
                </div>
                <div>
                    <span>최근 등록 기부 사업</span>
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>사업명</th>
                                <th>모금 시작일</th>
                                <th>모금 종료일</th>
                                <th>목표 모금액</th>
                                <th>모금액</th>
                                <th>입금 여부</th>
                                <th>사업 시작일</th>
                                <th>사업 종료일</th>
                                <th>상세 페이지</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bizList.map(function(biz, index){
                                return  <Biz key={"biz"+index} biz={biz}/>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}

//소식 하나에 대한 컴포넌트
function News(props){
    const news = props.news;
    const navigate = useNavigate();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    let content;
    if(news.alarmType === 3){
        content = `[입금완료] ${news.bizName} 기부사업의 모금액 입금이 완료되었습니다.`;
    }else if(news.alarmType === 4){
        content = `[사업종료] ${news.bizName} 기부사업이 종료되었습니다.`;
    }
    
    // 알림 아이템 클릭 시 호출되는 핸들러 함수
    function handleClick() {
        markAsRead(news.alarmNo);
        if(news.alarmType === 3){
            navigate('/biz/view/' + news.bizNo);
        }else if(news.alarmType === 4){
            navigate('/biz/view/' + news.bizNo);
        }
    }
    

    // 알림 읽음 처리 함수
    function markAsRead(alarmNo){
        //console.log("alarmNo" , alarmNo);
        let options={};
        options.url= serverUrl + '/org/alarm/' + alarmNo;
        options.method = "patch";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData);
        });
    }



    return (
        
        <div 
            className="news-info" 
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                color: news.alarmRead === 1 ? 'gray' : 'black',
                backgroundColor: news.alarmRead === 1 ? '#f0f0f0' : 'white',
            }}
        >
         
            <div>{content}</div>
            <div>
                <span>{news.alarmDate}</span>
            </div>
        </div>
    );

}

//사업 1개
function Biz(props){
    const biz = props.biz;

    const navigate = useNavigate();

    //상세 페이지로 이동
    function clickBtn(){
        navigate("/biz/view/" + biz.bizNo);
    }

    return (
        <tr>
            <td>{biz.bizName}</td>
            <td>{biz.bizDonateStart}</td>
            <td>{biz.bizDonateEnd}</td>
            <td>{biz.bizGoal != null ? biz.bizGoal.toLocaleString("ko-KR") : 0}원</td>
            <td>{biz.donateMoney != null ? biz.donateMoney.toLocaleString("ko-KR") : 0}원</td>
            <td>{biz.payoutYN != null ? "O" : "X"}</td>
            <td>{biz.bizStart}</td>
            <td>{biz.bizEnd}</td>
            <td><button type="button" onClick={clickBtn}>상세 페이지</button></td>
        </tr>
    )
}