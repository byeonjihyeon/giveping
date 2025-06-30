import NewsList from "./NewsList";
import NewsWrite from "./NewsWrite";
import NewsView from "./NewsView";
import NewsUpdate from "./NewsUpdate";
import { Route, Routes } from "react-router-dom";
export default function NewsMain(){


    return(
    <Routes>
        <Route path='list' element={<NewsList />} />
        <Route path='write' element={<NewsWrite />} />
        <Route path='view/:newsNo' element={<NewsView />} />
        <Route path='update/:updateNo' element={<NewsUpdate />} />
    </Routes>

    )
}