import { useEffect, useRef, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

export default function ProfileUpdate(props){
    const member = props.member; //회원 수정완료후, 사이드메뉴 정보 변경하기 위함
    const setMember = props.setMember;
    
    //스토리지에서 회원번호 추출용도
    const {loginMember} = useUserStore();
    
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //프로필 이미지 미리보기용 변수 (서버에 전송 x)
    const [profileImg, setProfileImg] = useState(null);

    //프로필 파일'객체' (서버에 전송 O)
    const [profile, setProfile] = useState(null);

    //input[type=file]인 프로필 업로드 요소와 연결하여 사용
    const profileImgEl = useRef(null);

    //프로필 이미지 변경시 호출함수(
    function chgProfileImg(e){
        const files = e.target.files;
        
        if(files.length != 0 && files[0] != null){
            setProfile(files[0]);           //서버에 전송된 이미지 파일 객체 세팅

            //프로필 이미지 화면에 보여주기
            const reader = new FileReader();    //브라우저에서 파일을 비동기적으로 읽어올 객체 생성
            reader.readAsDataURL(files[0]);     //파일 데이터 읽어오기
            reader.onloadend = function(){      //모두 읽어오면, 실행할 함수
            setProfileImg(reader.result);       //미리보기용 state변수에 세팅
            
            }
        }else {
            //업로드 팝업 취소한 경우, 썸네일 파일 객체와 미리보기용 변수 초기화
            setProfile(null);
            setProfileImg(null);
             
        }
    }
    
    //프로필 변경버튼 클릭후, 동작함수
    function chgProfile(e){
        if(profile == null){
            alert('파일 업로드후, 눌러주세요.');
            return;
        }
        console.log(member.memberProfile);
        const form = new FormData();
        form.append('memberNo', loginMember.memberNo);      //회원 정보(번호, 아이디, 이름, 전화번호, 생년월일, 이메일, 주소)
        form.append('profile', profile);                    //업로드할 프로필 사진 '객체'
        
        if(member.memberProfile != null){
            form.append('memberProfile', member.memberProfile); //현재 서버 통해 보여지는 파일명 (있을수도, 없을수도 있음)
        }
        
        let options = {};
        options.url = serverUrl + '/member/profile';
        options.method = 'post'; 
        options.data = form;
        options.headers = {};
        options.headers.contentType = 'multipart/form-data';
        options.headers.processData = false; 

        axiosInstance(options)
        .then(function(res){
            setProfile(null);
            setProfileImg(null);
            setMember({...member, memberProfile: res.data.resData});
        })
    }

    return (
        <div>
            <div className="input-wrap">
                {
                 profileImg ?   //미리보기 파일이 있는지?
                    <img className="input-title-wrap"  src={profileImg} onClick={function(e){
                        profileImgEl.current.click();
                    }} />
                 :
                member.memberProfile ? //서버에 저장된 프로필이미지가 있는지?
                <img className="input-title-wrap"  src={serverUrl + "/member/" + member.memberProfile.substring(0,8) + "/" + member.memberProfile} onClick={
                    function(e){
                        profileImgEl.current.click();
                    }} />    

                 :
                <img className="input-title-wrap"  src='/images/default_profile.jpg' onClick={function(e){
                    profileImgEl.current.click();
                }} />
                }
                <input type='file' accept="image/*" id='memberProfile' style={{display: 'none'}} ref={profileImgEl} onChange={chgProfileImg} />
                
            </div>
            <div>
                <button onClick={chgProfile}>프로필 변경하기</button>
                <input type="button" value='기본이미지로 변경' onClick={function(e){
                    //미리보기용, 서버전송용 변수 null 처리하여, 기본이미지로 변경 (서버에 저장된 파일이 없는경우!)
                    if(member.memberProfile == null || member.memberProfile == ""){
                        setProfileImg(null);
                        setProfile(null);
                        return;
                    }

                    //서버에 저장된 DB 및 파일 삭제 (서버에 저장된 파일이 있는 경우)
                    Swal.fire({
                        title : '알림',
                        text : '프로필 초기화하시겠습니까?',
                        icon : 'warning',
                        showCancelButton: true,
                        confirmButtonText: '초기화',
                        cancelButtonText: '취소'
                    }).then(function(res){
                        if(res.isConfirmed){
                            let options = {};
                            options.url = serverUrl + '/member/profile/' + loginMember.memberNo;
                            options.method = 'patch';
                            
                            axiosInstance(options)
                            .then(function(res){
                                if(res.data.resData){
                                setMember({...member, memberProfile: null});
                                
                                }
                            })
                        }
                    })
                    }}/>
            </div>
        </div>
    )
}