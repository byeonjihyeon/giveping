import { Link } from "react-router-dom";
import Header from "../common/Header";
import * as React from 'react';
import { Box, Typography, Divider,Fade, Card, CardContent, Grid, CardActions, Button } from '@mui/material';



export default function CompanyIntroduction () {
    
    return (
        <section className="section" style={{width:"100%"}}>
           {/*<div className="page-title">Don Give Up!</div>*/}
            <div className="about-page">
      <header className="hero">
       
       <div className="intro">
        <img style={{height:400, width: 1000}} src="/images/intro3_img.jpg" alt="기부사이트 소개 이미지" />
      </div>
      
         </header>

    
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4e6bff' }}>
        우리의 기부 플랫폼을 소개합니다
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" paragraph>
        우리 플랫폼은 다양한 단체들이 진행하는 기부 사업을 투명하고 공정하게 관리하고,
        시민들이 믿고 참여할 수 있도록 돕는 **비영리 기반의 기부 중개 서비스**입니다.
      </Typography>

      <Typography variant="body1" paragraph>
        단체는 사업 내용을 신청하고, 관리자는 그 신청을 심사한 후 승인 또는 반려 처리할 수 있습니다.
        승인된 사업은 기부자들이 열람하고 후원할 수 있는 형태로 게시됩니다.
      </Typography>

      <Typography variant="body1" paragraph>
        반려된 사업은 사유와 함께 다시 수정할 수 있고, 관리자와 단체 간의 피드백을 통해
        더욱 신뢰도 높은 기부 사업으로 발전할 수 있습니다.
      </Typography>

      <Divider sx={{ my: 3 }} />

      
  <div style={{display:"flex" ,justifyContent:"space-evenly" }}>
  <div class="card">
    <h2> 개인 회원이라면?</h2>
    <p>
      나에게 딱 맞는 기부 환경을 제공합니다.<br/>
      • 관심 단체 소식 자동 알림<br/>
      • 예치금 충전 / 환불 / 기부 내역 관리
    </p>
    <a href="/join/member" class="btn primary"> 개인회원 가입하기</a>
  </div>

  <div className="card" style={{display:"gap:10" }}>
    <h2> 단체 회원이라면?</h2>
    <p/>
      따뜻한 활동을 널리 알릴 수 있어요.<br/>
      • 기부 사업 등록 및 수정<br/>
      • 단체 소개 게시판 운영<br/>
      • 신뢰 온도 상승으로 후원자 신뢰 확보
    <br/>
    <a href="/join/org" class="btn success">단체회원 가입하기</a>
  </div>
 </div>
     </Box>

   
      {/* ...다른 섹션들 */}
    </div>
        </section>

        
    );
}