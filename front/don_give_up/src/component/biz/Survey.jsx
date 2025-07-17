import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";

export default function Survey(props){
    const onClose = props.onClose;
    const donateBiz = props.donateBiz;
    const navigate = useNavigate();

    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    // 설문조사 질문 저장 변수
    const [questionList, setQuestionList] = useState([]);

    // 설문조사 답변 상태 저장 변수
    const [answers, setAnswers] = useState([]);

    const location = useLocation();
    const stateBizNo = location.state?.bizNo;

    // 설문조사 질문 리스트 가져오기
    useEffect(function(){

        let options = {};
        options.url = serverUrl + '/biz/survey';
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            const questions = res.data.resData;
            setQuestionList(questions);
            //questionList안에는 question 객체가 여러 개 들어있음 => map 으로 객체 하나씩 꺼내오기
            
            // 초기 답변 상태 설정하기
            const initialAnswers = questions.map(q =>({
                questionNo : q.questionNo,
                answerScore : null, // 1~5 점 중, 선택한 점수가 들어감
                memberNo : loginMember.memberNo,
                bizNo: donateBiz.bizNo || stateBizNo  // 소식 페이지에서 넘어왔을 때, bizNo 값 null이므로
            }));

            setAnswers(initialAnswers);
       
        });

    }, []); 

    // 점수 선택 시, 점수 변경하는 핸들러
    function handleScoreChange(index, score){
        const newAnswers = [...answers];
        newAnswers[index].answerScore = score;
        setAnswers(newAnswers);
     }


    // 제출하기 버튼 클릭 시 호출되는 함수
    function submit(){
        const bizNo = donateBiz?.bizNo || stateBizNo;

        if (!bizNo) {
        Swal.fire({
                    title : '알림',
                    text : '기부 사업 정보가 없습니다. 다시 시도해주세요.',
                    icon : 'warning'
            });
        return;
        }

        // 모든 질문에 점수 선택했는지 확인 
        const hasUnanswered = answers.some(function(answer){
            return answer.answerScore == null;
        });

        if(hasUnanswered){
            Swal.fire({
                    title : '알림',
                    text : '모든 질문에 점수를 선택해주세요.',
                    icon : 'warning'
            });
            return;
        }

         // answers를 bizNo 포함하여 재구성
        const fixedAnswers = answers.map(a => ({
            ...a,
            bizNo: bizNo
        }));

        let options={};
        options.url = serverUrl + "/biz/survey";
        options.data =  fixedAnswers;
        options.method="post";

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                onClose();  // 성공 시, 팝업 종료
                navigate("/biz/view/"+bizNo);
            }
        });
        
    }


    return(
        <div className="modal-overlay">
            <div className="modal-contents survey-modal">
                <h3 className="modal-title">설문조사</h3>
                <div className="survey-body">
                    <p className="survey-subtitle">질문</p>
                    <div className="question-list">
                             {questionList.map((question, index) => (
                                <QuestionItem key={"question" + index} question={question} selectedScore={answers[index]?.answerScore}
                                              onScoreChange={(score) => handleScoreChange(index, score)}
                                              index={index}/>
                            ))}
                    </div>
                </div>
              
                <div className="modal-actions">
                <button onClick={submit}>제출하기</button>
                <button onClick={onClose}>닫기</button>
            </div>
            </div>
            </div>
    )
}

function QuestionItem(props){
    const question = props.question;
    const selectedScore = props.selectedScore;
    const onScoreChange = props.onScoreChange;
    const index = props.index;

    return(
        <div className="question-card">
            <div className="question-header">
                <div className="question-number">질문 {index+1}.</div>
                <div className="question-text">{question.questionContent}</div>
            </div>
             <div className="score-options">
                {[1,2,3,4,5].map(score => (
                    <label key={score} style={{marginRight: '10px'}}>
                        <input 
                            type="radio"
                            name={"question-" + question.questionNo}
                            value={score}
                            checked={selectedScore === score}
                            onChange={function(){onScoreChange(score)}}
                            />
                        <span className="score-value">{score}점</span>
                    </label>
                ))}
                </div>
        </div>
    );
}