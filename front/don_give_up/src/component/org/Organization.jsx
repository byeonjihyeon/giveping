import {Route, Routes} from "react-router-dom";
import OrgList from "./organization/OrgList";
import OrgView from "./organization/OrgView";

export default function Organization(){
// 단체 게시판 메인
    return (
            <Routes>
                <Route path="list" element ={<OrgList />} />
                <Route path="view/:bizNo" element ={<OrgView />} />
            </Routes>
    );
}
       
