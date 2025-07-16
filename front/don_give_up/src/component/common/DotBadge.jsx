import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Swal from "sweetalert2";


// 알람 아이콘
export default function DotBadge() {
    const {isLogined, setIsLogined, loginMember, loginOrg, unreadAlarmCount, setUnreadAlarmCount, fetchUnreadAlarmCount} = useUserStore();
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
        Swal.fire({
                  title : '알림',
                  text : '로그인이 필요합니다.',
                  icon : 'warning'
            });
        navigate("/login"); // 로그인 페이지로 보내는 것도 가능
      } else {
        Swal.fire({
                  title : '알림',
                  text : '회원 정보가 올바르지 않습니다.',
                  icon : 'warning'
            });
      }
    }

    useEffect(function(){
        // 로그인 안 했거나 회원 정보 없을 경우 return
        if (!isLogined) return;

        // DotBadge 업데이트를 위해 useUserStore의 함수 호출
          fetchUnreadAlarmCount();
        }, [isLogined, loginMember, loginOrg]);

  return (
    <Box sx={{ color: 'action.active'}} onClick={handleClick} style={{cursor: 'pointer'}}>
      <Badge
        badgeContent={unreadAlarmCount}
        color="primary"
        /*variant="dot" */
       /* invisible={!hasNewAlert} */ // true일 때 dot 표시(안 읽은 알람 있음), false면 숨김(안 읽은 알람 없음)
      >
        <MailIcon sx={{fontSize: 25, color: '#B0B0B0'}} />
      </Badge>
    </Box>
  );
}