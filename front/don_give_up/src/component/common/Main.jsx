
import { useState } from "react";
import MainList from "./MainList";
import { Link } from "react-router-dom";


export default function Main(){
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
        </>
    )
}