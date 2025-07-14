import {Route, Routes} from "react-router-dom";
import OrgList from "./OrgList";
import OrgView from "./OrgView";

export default function Organization(){
// 단체 게시판 메인
    return (
            <Routes>
                <Route path="list" element ={<OrgList />} />
                <Route path="view/:orgNo" element ={<OrgView />} />
            </Routes>
    );
}
       
