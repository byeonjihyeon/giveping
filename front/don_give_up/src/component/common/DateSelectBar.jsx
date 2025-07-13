import { endOfMonth, format, getMonth, getYear, isAfter, isBefore} from "date-fns";
import { useState } from "react"
import './dateSelectBar.css'

//년,월기준 선택하여 기간 조회(Ex 2024.07 ~ 2025.07)
export default function DateSelectBar(props){

    const startDate = props.startDate;  
    const endDate = props.endDate;
    const setStartDate = props.setStartDate;
    const setEndDate= props.setEndDate; 
    
    //초기값 (현재 기준 1년 2024년 7월 ~ 2025년 7월)
    const [form, setForm] = useState({
        startYear: getYear(new Date())-1,       //현재 년도 - 1 
        endYear: getYear(new Date()),           //현재 년도
        startMonth: getMonth(new Date())+1,     //현재년도 기준 월
        endMonth: getMonth(new Date())+1        //현재년도 기준 월                             
    })

    const yearArr = [];
    const monthArr = [];
    
    //현재 년도에서 -2년 전까지 범위 설정
    for(let i=0; i<3; i++){
        yearArr.push(getYear(new Date()) - i);
    }

    //1월 ~ 12월 배열
    for(let i=0; i<12; i++){
        monthArr.push(i+1);
    }
    
    //select onChange시,
    function updDate(e){
        form[e.target.id] = e.target.value;
        setForm({...form});
        
    }

    //해당 기간 설정후, 검색 버튼 클릭시
    function searchDate(){

        let start = new Date(form.startYear, form.startMonth-1);
        let end = endOfMonth(new Date(form.endYear, form.endMonth-1));

        //유효성검사
        //isAfter : 첫번째 날짜가 두번째 날짜 이후인지 확인
        if(isAfter(start, end)){
            alert('날짜를 다시 확인하여 주세요.');
            return;
        }

        let startDateStr = format(new Date(form.startYear, form.startMonth-1), 'yyyy-MM-dd HH:mm:ss');  
        let endDateStr = format(endOfMonth(new Date(form.endYear, form.endMonth-1)), 'yyyy-MM-dd HH:mm:ss');

        setStartDate(startDateStr); //시작날짜 : 1일 + 00:00:00
        setEndDate(endDateStr); //검색연도, 월 전달하여 해당월의 마지막날짜 + 23:59:59 반환
    }

    return (
        <>
            <select id='startYear' value={form.startYear} onChange={updDate}>
                {yearArr.map(function(startYear, index){
                    return <option key={"startYear" + index} value={startYear}>{startYear}</option>
                })}
            </select>
            <select id='startMonth' value={form.startMonth} onChange={updDate}>
                {monthArr.map(function(startMonth, index){
                    return <option key={"startMonth" + index} value={startMonth}>{startMonth}</option>
                })}
            </select>
            ~
            <select id='endYear' value={form.endYear} onChange={updDate}>
                {yearArr.map(function(endYear, index){
                    return <option key={"year" + index} value={endYear}>{endYear}</option>
                })}
            </select>
            <select id='endMonth' value={form.endMonth} onChange={updDate}>
                {monthArr.map(function(endMonth, index){
                    return <option key={"endMonth" + index} value={endMonth}>{endMonth}</option>
                })}
            </select>
            <button className="searchBtn" type="button" onClick={searchDate}>검색</button>
        </>
    )
}
