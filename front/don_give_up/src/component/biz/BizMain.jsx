import BizList from "./BizList";
import {Route, Routes} from "react-router-dom";

// 기부 사업 게시판 메인
export default function BizMain(){


    return (
            <Routes>
                <Route path="list" element ={<BizList />} />
            </Routes>
    );
}