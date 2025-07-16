
import { useEffect, useState } from "react";
import MainList from "./MainList";
import { Link, useNavigate } from "react-router-dom";
import createInstance from '../../axios/Interceptor';
import { format } from 'date-fns';

export default function Main(){

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //검색창에 보여줄 선택한 카테고리 배열
    const [choseList, setChoseList] = useState([]);

    //기부사업 컴포넌트에 전달할 String 배열 (카테고리 코드값)
    const [codeArr, setCodeArr] = useState([]);

    const categories = [
        {code: 'D01', name: '아동 👧'},
        {code: 'D02', name: '노인 👨‍🦳'},
        {code: 'D03', name: '난민 🌍'},
        {code: 'D04', name: '환경 🌳'},
        {code: 'D05', name: '장애인 🤟'},
        {code: 'D06', name: '교육 🎨'},
        {code: 'D07', name: '재해지원 💧'}
    ]

    //총 기부금액 변수
    const [donationAmount, setDonationAmount] = useState(0);

    //소식리스트 변수
    const [mainNewsList, setMainNewsList] = useState([]);

    //오늘 날짜
    const today = new Date();
    const formatDate = format(today, 'yyyy.MM.dd');

    //총 기부금 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/donationAmount';
        options.method = 'get'

        axiosInstance(options)
        .then(function(res){
            setDonationAmount(res.data.resData);
        });
    },[]);

    //소식 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/mainNews';
        options.method = 'get'

        axiosInstance(options)
        .then(function(res){
            setMainNewsList(res.data.resData);
        })
    },[]);

    return (
        <>
            <div className="banner-wrap">
                <div className="title">
                    <span>관심있는 카테고리를 선택해주세요 ! </span>
                </div>
                <div className="search-bar">
                    <div className="main-category">
                        {categories.map(function(ctg, index){
                            return <div key={"ctg" + index} onClick={function(){    //카테고리 클릭시, 검색창에 보여줄 명과, 컴포넌트에 전달할 코드 추가
                                let ctgName = ctg.name; //아이콘을 포함한 카테고리명
                                let index = ctgName.indexOf(' ');   //' ' 인덱스 위치
                                ctgName = ctgName.slice(0, index + 1) //아이콘을 제외한 문자열

                                let chose = {code: ctg.code, name: ctgName};

                                let result = false; //중복체크 변수

                                choseList.forEach(function(fchose){
                                    if(fchose.name == chose.name){
                                        return result = true;   //중복 카테고리명이있다면 true 리턴.
                                    }    
                                })

                                if(!result && choseList.length < 4){ //중복카테고리명이 없고, 최대 카테고리 수가 4개 보다작다면, 화면에 보여줄 배열에추가
                                    choseList.push(chose);
                                    setChoseList([...choseList]);
                                }

                                if(!codeArr.includes(ctg.code) && codeArr.length < 4){  //중복카테고리명이 없고, 최대 카테고리 수가 4개 보다작다면, 서버에 보낼 배열에 추가
                                    codeArr.push(ctg.code);
                                    setCodeArr([...codeArr]);
                                }
                            }}>{ctg.name}</div>
                        })}
                    </div>
                </div>
                <div className="bar">
                    {choseList != null && choseList.length > 0 ?
                        choseList.map(function(chose,index){
                            return  <div className='chose' key={"chose" + index} onClick={function(){
                                                                                            let newChoseList = choseList.filter(function(fChose, fIndex){
                                                                                                return chose != fChose;
                                                                                            })
                                                                                            setChoseList(newChoseList);
                                                                                            
                                                                                            let newCodeArr = codeArr.filter(function(fCode, fIndex){
                                                                                                return chose.code != fCode;
                                                                                            })
                                                                                            setCodeArr(newCodeArr);
                            }}>
                                        <span>{chose.name}</span>
                                        <span>X</span>
                                    </div>
                    })
                    :
                    ""
                    }
                    <Link to='/biz/list' state={codeArr} ><img src='/images/searchGlass_30dp_DCDCDC.png' /></Link> 
                </div>
                <div className="banner-img">
                    <img src='/images/GivePing.png' />
                </div>
            </div>
            <MainList />
            <div className="all-donation-status">  
                <div className="title">
                    <div>우리가 함께 만든 변화의 총합</div>
                    <div className="today">{formatDate} 기준</div>
                </div>
                <div className="all-money">
                    <span>총 기부금</span>
                    <span>₩ {donationAmount} 원</span>
                    </div>       
            </div>
            
            <div className="main-titles" >
                <span className="content-title">지금, 현장에서 전해온 소식 💌</span>
            </div>
            <div className="main-newsList">
                {mainNewsList.length != null && mainNewsList.length > 0 ?
                    mainNewsList.map(function(news, index){
                        return  <MainNews news={news} />
                    })
                :
                <div>등록된 소식이 없습니다.</div>
                }
               
            </div>
        </>
    )
}

//소식 컴포넌트
function MainNews(props){
    const news = props.news;
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    const navigate = useNavigate();
    return (
        <div className="main-news" onClick={function(){
            navigate('/news/view/' + news.newsNo);
        }}>
            <div className="thumb">
                <img
                        src={
                        news.newsThumbPath
                            ? serverUrl + "/news/thumb/" + news.newsThumbPath.substring(0, 8) + "/" + news.newsThumbPath
                            : "/images/default_img.png"
                        }
                        alt="뉴스 썸네일"
                    />
            </div>
            <div className="main-news-info"> 
                <div className="orgName">{news.orgName}</div>
                <div className="newsName">{news.newsName}</div>
                <div className="link">자세히 보기  &gt;</div>
            </div>
        </div>
    )

}
    
