
import { useState } from "react";
import MainList from "./MainList";


export default function Main(){
    const [categories, setCategories] = useState([
        '아동 👧', '노인 👨‍🦳', '난민 🌍', '환경 🌳', '장애인 🤟', '교육 🎨', '재해지원 💧'
    ]);

    return (
        <>
        <div className="banner-wrap">
            <div className="title">
                <span>관심있는 카테고리를 선택해주세요 ! </span>
            </div>
            <div className="search-bar">
                <div className="">

                </div>
                <div className="main-category">
                    {categories.map(function(ctg, index){
                        return <div key={"ctg"+index}>{ctg}</div>
                    })}
                </div>
            </div>
        </div>

        <MainList />
        </>
    )
}