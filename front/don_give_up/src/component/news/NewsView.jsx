import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
export default function NewsView(){
    const param = useParams();
    const bizNo = param.bizNo;
    console.log(bizNo);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해온 게시글 1개 정보 저장 변수
    const [news, setNews] = useState({});

    //로그인 회원 정보 (관리자일 경우에만 수정, 삭제 버튼 활성화)
    //const {loginMember} = useUserStore(); 

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/news/' + newsNo;
        options.method = 'get';


        axiosInstance(options)
        .then(function(res){
            setNews(res.data.resData);
        });

    }, []);

    const navigate = useNavigate();
    //삭제하기 클릭 시, 동작 함수
    /*
    function deleteNews(){
        let options = {};
        options.url = serverUrl + '/news/' + news.newsNo;
        options.method = 'delete';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                navigate('/news/list');
            }
        });
    }
    */


    return(
    <></>

    )
}