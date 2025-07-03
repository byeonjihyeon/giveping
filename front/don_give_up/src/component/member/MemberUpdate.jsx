import { add, format } from "date-fns";
import { useEffect, useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";

//DatePicker(달력) import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";



//회원 정보 수정 페이지
export default function MemberUpdate(props) {
    //부모 컴포넌트(MemberMain) 추출, sideMenu 재랜더링하고자!
    const mainMember = props.member;
    const setMainMember = props.setMember;


    //스토리지에서 회원번호 추출용도 및 회원이름 변경시 재랜더링 하고자!
    const {loginMember, setLoginMember} = useUserStore();

    //화면표출 및 서버에 전송할 회원정보
    const [member, setMember] = useState({
        memberNo: loginMember.memberNo,      //회원번호
        memberId: "",                        //회원아이디
        memberName: "",                      //회원이름
        memberPhone: "",                     //회원전화번호
        memberBirth: "",                     //회원생년월일
        memberEmail: "",                     //회원이메일
        memberAddr: ""                       //회원주소
    });

    //전체 기부카테고리
    const [allCategory , setAllCategory] = useState([]);

    //회원 기존카테고리
    const [prevCategory, setPrevCategory] = useState([]);

    //선택한 카테고리
    const [choseCategory, setChoseCategory] = useState([]);
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //기존 회원정보 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/member/' + loginMember.memberNo;
        options.method = 'get'

        axiosInstance(options)
        .then(function(res){
            setMember(res.data.resData);
        })
    },[]);

    //input태그 onChange호출시,
    function updMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    //전체 기부카테고리 조회
    useEffect(function(){
        const options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            setAllCategory(res.data.resData);
        })
    },[])

    //회원의 기존 관심카테고리 조회
    useEffect(function(){
        const options = {};
        options.url = serverUrl + '/member/category/' + loginMember.memberNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            setPrevCategory(res.data.resData);
            setChoseCategory([...res.data.resData]);
        });

    },[])
    
    //수정하기 버튼 클릭시 동작함수
    function updateMember(){

        //삭제할 카테고리 : 기존카테고리 - 현재카테고리
        const delCategory = prevCategory.filter(function(code,index){return !choseCategory.includes(code)});
        //추가할 카테고리 : 현재카테고리 - 기존카테로기
        const addCategory = choseCategory.filter(function(code,index){return !prevCategory.includes(code)});
        
        let options = {};
        options.url = serverUrl + '/member';
        options.method = 'patch';   //수정
        options.data = {
                        member: member,
                        addCategory: addCategory,
                        delCategory: delCategory        
                        }
       
        axiosInstance(options)
        .then(function(res){
            if(member.memberName != loginMember.memberName){                        //이름이 변경되었다면, 스토리지변수 또한 변경
                setLoginMember({...loginMember, memberName: member.memberName});  //헤더, 사이드메뉴 재랜더링
                setMainMember({...mainMember, memberName: member.memberName})
            }
            
            if(member.memberEmail != mainMember.memberEmail){
                setMainMember({...mainMember, memberEmail: member.memberEmail});
            }
        })
    }

    return (
        <div className="update-frm-wrap" >
            <div className="input-wrap">
                <div className="input-title-wrap">아이디</div>
                <div>{member.memberId}</div>
            </div>
            <div className="input-wrap">
                <div className="input-title-wrap">이름</div>
                <div>
                    <input type="text" id='memberName' value={member.memberName} onChange={updMember} />
                    <p>이름 유효성 메시지창</p>
                </div>
            </div>
            <div className="input-wrap">
                <div className="input-title-wrap">생년월일</div>
                <div>
                    <input type='text' id='memberBirth' value={member.memberBirth} onChange={updMember}/>
                </div>
            </div>
            <div className="input-wrap">
                <div className="input-title-wrap" >전화번호</div>
                <div>
                    <input type="text" id='memberPhone' value={member.memberPhone} onChange={updMember}/>
                    <p>전화번호 유효성 메시지창</p>
                </div>
            </div>
            <div className="input-wrap">
                <div className="input-title-wrap">이메일</div>
                <div>
                    <input type="text" id='memberEmail' value={member.memberEmail} onChange={updMember}/>
                    <p>이메일 유효성 메시지창</p>
                </div>   
            </div>
    
            <div className="input-wrap">
                <div className="input-title-wrap">주소</div>
                <div>
                    <input type="text" id='memberAddr' value={member.memberAddr} onChange={updMember}/>
                </div>
            </div>
            <div className="input-wrap">
                <div className="input-title-wrap">카테고리</div>
                    <div className="category-wrap">
                        {allCategory.map(function(category, index){
                            
                            function chkCategory(e){
                               let divEl = e.target;
                               if(divEl.classList.contains('chosed-category')){     //선택 헤제시   
                                    divEl.classList.remove('chosed-category');
                                    setChoseCategory(choseCategory.filter(function(dCode,dIndex){
                                        return category.donateCode != dCode;
                                    }))
                               }else {  //선택시
                                    divEl.classList.add('chosed-category');
                                    if(!choseCategory.includes(category.donateCode)){
                                        setChoseCategory([...choseCategory, category.donateCode]);
                                    }
                               }    
                            }
                            return <div key={"category" + index} id={category.donateCode} className={"category-name" + (prevCategory.includes(category.donateCode) ? " chosed-category" : "")} onClick={chkCategory} >{category.donateCtg}</div>
                        })}
                    </div>
            </div>
            <div>
                <Link to='/member/delete'>탈퇴하기</Link>
            </div>
            <div className="update-btn-wrap">
                <button type="button" onClick={updateMember}>수정하기</button>
            </div>
        </div>
    )
}

