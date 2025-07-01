import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//회원가입 시 기부 카테고리 선택 페이지
export default function JoinCategory(props) {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const member = props.member;
    const setMember = props.setMember;
    const org = props.org;
    const setOrg = props.setOrg;

    //DB에서 조회한 카테고리 정보를 저장할 State 변수
    const [donateCtgList, setDonateCtgList] = useState([]);

    //체크한 카테고리 정보를 저장할 State 변수
    const [checkCtgList, setCheckCtgList] = useState([]);

    //DB에서 카테고리 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setDonateCtgList(res.data.resData);
        });
    }, []);

    useEffect(function(){
        setMember({...member, categoryList : checkCtgList});
    }, [checkCtgList]);

    useEffect(function(){
        setOrg({...org, categoryList : checkCtgList});
    }, [checkCtgList]);

    // 회원가입 버튼 클릭 시
    function join() {
        let options = {};
        if(member.memberId != ""){
            options.url = serverUrl + "/member/join";
            options.method = "post";
            options.data = member;
        }else{
            options.url = serverUrl + "/org/join";
            options.method = "post";
            options.data = org;
        }

        axiosInstance(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            })
            .then(function(result){
                if(res.data.resData){ //회원가입 정상 처리
                    navigate("/login"); //로그인 컴포넌트로 전환
                }
            });
        })
        .catch(function(err){
            console.log(err);
        })
    }

    return (
        <section className="section category-wrap">
            {member.memberId != ""
            ?
            <div className="page-title">관심 카테고리 선택</div>
            :
            <div className="page-title">주요 카테고리 선택</div>
            }
            <p>중복 선택 가능</p>

            <ul className="select-ctg-wrap">
                {donateCtgList.map(function (category, index) {
                    return  <DonateCtg key={"category"+index} category={category} checkCtgList={checkCtgList} setCheckCtgList={setCheckCtgList}/>
                })}
            </ul>

            <div style={{ marginTop: '20px' }}>
                <button onClick={join}>회원가입</button>
            </div>
        </section>
        );
    
    //카테고리 1개
    function DonateCtg(props){
        const category = props.category;
        const checkCtgList = props.checkCtgList;
        const setCheckCtgList = props.setCheckCtgList;

    //카테고리 클릭 시 토글
    function toggleCategory(code) {
        setCheckCtgList(function (prev) {
            if (prev.includes(code)) {
                // 이미 선택된 경우 제거
                return prev.filter(function (item) {
                return item !== code;
                });
            } else {
                // 새로운 선택 추가
                return [...prev, code];
            }
        });
    }   

        return (
            <li className={"select-ctg" + (checkCtgList.includes(category.donateCode) ? " active" : "")}
                onClick={function(){ toggleCategory(category.donateCode); }}>
                {category.donateCtg}
            </li>
          )
    }
}