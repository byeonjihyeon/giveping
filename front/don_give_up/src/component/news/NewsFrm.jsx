import { useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";

export default function NewsFrm(props){
//부모 컴포넌트에서 전달 받은 데이터 추출
    const loginMember = props.loginMember;
    const newsName = props.newsName;
    const setNewsName = props.setNewsName;
    const newsThumb = props.newsThumb;
    const setNewsThumb = props.setNewsThumb;
    const orgName = props.orgName;
    const setOrgName = props.setOrgName;
    const orgNo = props.orgNo;
    const setOrgNo = props.setOrgNo;
    const type = props.type;

    // 단체 리스트 검색을 위한 변수 선언
    const [orgList, setOrgList] = useState([]); // 단체 리스트
    const [showOrgList, setShowOrgList] = useState(false); // 목록 표시 여부

//수정 시, 전달 데이터 추출
    const prevThumbPath = props.prevThumbPath;
    const setPrevThumbPath = props.setPrevThumbPath;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //제목 변경 시, 호출 함수(onChange)
    function chgNewsName(e){
        setNewsName(e.target.value);
    }

    //단체 변경 시, 호출 함수(onChange)
    function chgOrgName(e){
        setOrgName(e.target.value);
    }

    //썸네일 이미지 미리보기용 변수(서버에 전송 X)
    const [thumbImg, setThumbImg] = useState(null);

    //input type=file인 썸네일 업로드 요소와 연결하여 사용.
    const thumbFileEl = useRef(null);

    //썸네일 이미지 변경 시, 호출 함수(onChange)
    function chgThumbFile(e){
        
        const files = e.target.files;

        if(files.length != 0 && files[0] != null){
            setNewsThumb(files[0]);        //게시글 등록하기 클릭 시, 서버에 전송될 썸네일 파일 객체

            //썸네일 이미지 화면에 보여주기
            const reader = new FileReader();    //브라우저에서 파일을 비동기적으로 읽을 수 있게 해주는 객체
            reader.readAsDataURL(files[0]);     //파일 데이터 읽어오기
            reader.onloadend = function(){       //모두 읽어오면, 실행할 함수 작성
                setThumbImg(reader.result);     //미리보기용 State 변수에 세팅
            }
        }else{
            //업로드 팝업 취소한 경우, 썸네일 파일 객체와 미리보기용 변수 초기화
            setNewsThumb(null);
            setThumbImg(null);
        }
    }

    // 단체 검색 요청
    function searchOrgByName() {
        if (!orgName || orgName.trim() === "") {
            Swal.fire({
                        title : '알림',
                        text : '단체명을 입력해주세요.',
                        icon : 'warning'
                });
            return;
        }

        const options = {
            method: 'get',
            //url: `${serverUrl}/news/${orgName}`
            url : serverUrl + '/news/org/' + orgName
        };

        axiosInstance(options)
        .then(res => {
            if (res.data.resData.length > 0) {
                setOrgList(res.data.resData);
                setShowOrgList(true);
            } else {
                Swal.fire({
                            title : '알림',
                            text : '해당 단체명이 존재하지 않습니다.',
                            icon : 'warning',
                            showCancelButton : false,
                            confirmButtonText : '확인'
                        }).then(function(res){
                            setOrgList([]);
                            setShowOrgList(false);
                        });
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    // 단체 하나 클릭 시 orgNo 세팅
    function selectOrg(org) {
        setOrgName(org.orgName); // input에 단체명 반영
        setOrgNo(org.orgNo);     // 상태로 orgNo 저장
        setShowOrgList(false);   // 리스트 닫기
    }

    


    return(
    <div className="board-wrap" style={{ display: 'flex', gap: '2rem' }}>
            <div className="board-thumb-wrap">
                {thumbImg
                 ?
                    <img src={thumbImg} onClick={function(e){
                        //e.target == img 요소 객체
                        //e.target의 속성을 이용해서, 다음 요소인 input을 동적으로 click하는게 가능하지만, React에서 권장되지 않음.
                        //useRef라는 훅을 이용해, 자바스크립트 변수와 input요소를 연결시키고, 해당 변수를 이용해서 컨트롤이 가능하다.
                        thumbFileEl.current.click(); 
                    }}></img>
                 :
                    prevThumbPath
                    ?
                        <img src={serverUrl + "/news/thumb/" + prevThumbPath.substring(0,8) + "/" + prevThumbPath} onClick={function(){
                            thumbFileEl.current.click();
                        }} />
                    :
                        <img src="/images/default_img.png" onClick={function(e){
                            //e.target == img 요소 객체
                            //e.target의 속성을 이용해서, 다음 요소인 input을 동적으로 click하는게 가능하지만, React에서 권장되지 않음.
                            //useRef라는 훅을 이용해, 자바스크립트 변수와 input요소를 연결시키고, 해당 변수를 이용해서 컨트롤이 가능하다.
                            thumbFileEl.current.click(); 
                        }}></img>
                }
                <input type="file" accept="image/*" style={{display : 'none'}} ref={thumbFileEl} onChange={chgThumbFile}/>
            </div>

            <div className="board-info-group">
            <div className="board-info-wrap">
                <table className="tbl">
                    <tbody>
                        <tr>
                            <th style={{width : "30%"}}>
                                <label htmlFor="boardTitle">제목</label>
                            </th>
                            <td>
                                <input type="text" 
                                        id="newsName" 
                                        name="newsName" 
                                        value={newsName}
                                        onChange={chgNewsName}
                                        className="input-text"
                                        />
                            </td>
                        </tr>
                        <tr>
                            <th>단체명</th>
                            <td>
                                <input type="text" 
                                        id="orgName" 
                                        name="orgName" 
                                        value={orgName}
                                        onChange={chgOrgName}
                                        className="input-text"
                                        />
                                <button type="button" onClick={searchOrgByName} className="btn-primary sm">
                                조회
                                </button>
                            </td>
                        </tr>
                        {
                            showOrgList && orgList.length > 0 &&
                            <tr>
                                <th>단체 조회 결과</th>
                                <td>
                                    <ul className="org-list">
                                        {orgList.map((org, idx) => (
                                            <li key={idx}>
                                                <button type="button" onClick={() => selectOrg(org)}>
                                                    {org.orgName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </div>

    )
}