import {Route, Routes} from "react-router-dom";
import BizList from "./BizList";
import BizView from "./BizView";
import BizUpdate from "./BizUpdate";

// 기부 사업 게시판 메인
export default function BizMain(){


    return (
            <Routes>
                <Route path="list" element ={<BizList />} />
                <Route path="view/:bizNo" element ={<BizView />} />
                 <Route path='update/:bizNo' element={<BizUpdate />} />
            </Routes>
    );
}