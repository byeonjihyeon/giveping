import { useState } from "react"



//마이페이지 소식페이지
export default function NewsList(){

    const [newsList, setNewsList] = useState([
        {title: '제목1', content: '내용1', date: '2025-06-30', sender: '운영자'},
        {title: '제목2', content: '내용2', date: '2025-06-30', sender: '운영자'},
        {title: '제목3', content: '내용3', date: '2025-06-30', sender: '운영자'},
        {title: '제목4', content: '내용4', date: '2025-06-30', sender: '운영자'},
        {title: '제목5', content: '내용5', date: '2025-06-30', sender: '운영자'}
    ]);


    return (
        <div className="NewsList-wrap" >
            <Timeline>
            {newsList.map(function(news,index){
                    
            })}
           </Timeline>
        </div>
    )
}





