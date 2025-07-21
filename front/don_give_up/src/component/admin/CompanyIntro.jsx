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

<br/>
      <Typography variant="body1" paragraph>
        우리 플랫폼은 다양한 단체들이 진행하는 기부 사업을 투명하고 공정하게 관리하고,
        시민들이 믿고 참여할 수 있도록 돕는 **비영리 기반의 기부 중개 서비스**입니다. <br/><br/>

        <strong style={{color:"#F38C79", fontSize:"20px"}}>“Don’t give up(포기하지 마)”</strong>이라는 문장에
        <strong style={{color:"#F38C79", fontSize:"20px"}}> ‘Don(돈)’</strong>이라는 단어를 결합해,<br/>
        <strong style={{color:"#F38C79", fontSize:"20px"}}>**‘돈을 가치 있게 give(기부)하자’**</strong>는 중의적 의미를 담았습니다.<br/>

      </Typography>

      <Typography variant="body1" paragraph>
        기부자는 관심 있는 단체를 지정할 수 있고,
        해당 단체의 사업이 마이페이지에 자동으로 표시됩니다.

        사용자가 설정한 관심 카테고리 사업을
        메인페이지에 모아서 보여주는 기능을 통해
        보다 맞춤형 기부 환경을 제공합니다.

      </Typography>

      <Typography variant="body1" paragraph>
      
      </Typography>


      <Typography variant="body1" paragraph>
        또한 당근마켓의 ‘이용자 온도’ 시스템을 벤치마킹하여,
        기부 단체의 신뢰도를 ‘신뢰 온도’로 시각화함으로써
        후원자들이 더 신뢰할 수 있는 단체를 쉽게 선택할 수 있도록 돕습니다.
      </Typography>
      <br/>


      <Divider sx={{ my: 3 }} />

      
  <div style={{display:"flex" ,justifyContent:"space-evenly" }}>
  <div className="card">
    <h2> 개인 회원이라면?</h2>
    <p>
      나에게 딱 맞는 기부 환경을 제공합니다.<br/>
      • 관심 단체 소식 자동 알림<br/>
      • 카테고리별 검색 기능<br/>
      • 예치금 충전 / 환불 / 기부 내역 관리
    </p>
    <a href="/join/member" className="btn primary"> 개인회원 가입하기</a>
  </div>

  <div className="card" style={{display:"gap:10" }}>
    <h2> 단체 회원이라면?</h2>
    <p/>
      따뜻한 활동을 널리 알릴 수 있어요.<br/>
      • 기부 사업 등록<br/>
      • 단체 소개 게시판 운영<br/>
      • 신뢰 온도 상승으로 후원자 신뢰 확보
    <br/>
    <a href="/join/org" className="btn success">단체회원 가입하기</a>
  </div>
 </div>

 <div>


 </div>
     </Box>

   
      {/* ...다른 섹션들 */}
    </div>
        </section>

        
    );
}