import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';


// 알람 아이콘
export default function DotBadge() {
    const {isLogined, setIsLogined, loginMember, loginOrg} = useUserStore();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const { memberNo } = useParams();

     const navigate = useNavigate();

    function handleClick() {
      if (loginMember?.memberNo && !loginOrg?.orgNo) {
        navigate("/member/news");  // 개인회원
      } else if (loginOrg?.orgNo && !loginMember?.memberNo) {
        navigate("/org/news");     // 단체회원
      } else if (!loginMember && !loginOrg) {
        alert("로그인이 필요합니다.");
        navigate("/login"); // 로그인 페이지로 보내는 것도 가능
      } else {
        alert("회원 정보가 올바르지 않습니다.");
      }
    }



    // 알림 여부 상태
    const [hasNewAlert, setHasNewAlert] = useState(false);
    

    useEffect(function(){
        // 로그인 안 했거나 회원 정보 없을 경우 return
        if (!isLogined || !loginMember) return;

            let options = {};
            options.url = serverUrl + '/countAlarm/' + loginMember.memberNo;
            options.method = 'get';
    
            axiosInstance(options)
            .then(function(res){
                console.log(res.data.resData);

                const count = res.data.resData;
                if(count > 0){
                    setHasNewAlert(true);
                }else{
                    setHasNewAlert(false);
                }
            });
    
        }, [isLogined, loginMember]);

  return (
    <Box sx={{ color: 'action.active' }} onClick={handleClick} style={{cursor: 'pointer'}}>
      <Badge
        color="secondary"
        variant="dot"
        invisible={!hasNewAlert}  // true일 때 dot 표시(안 읽은 알람 있음), false면 숨김(안 읽은 알람 없음)
      >
        <MailIcon />
      </Badge>
    </Box>
  );
}