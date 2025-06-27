import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";

//회원가입 시 기부 카테고리 선택 페이지
export default function JoinCategory() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [donateCtgList, setDonateCtgList] = useState([]);

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/donateCtg";
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            console.log(res);
        });
    }, []);

    return (
        <section className="section category-wrap">
            <div className="page-title">관심 카테고리 선택</div>
            <div className="page-title">주요 카테고리 선택</div>
            <p>중복 선택 가능</p>
            
        </section>
    )
}