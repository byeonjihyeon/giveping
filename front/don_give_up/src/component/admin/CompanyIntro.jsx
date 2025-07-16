import { Link } from "react-router-dom";
import Header from "../common/Header";
import * as React from 'react';
import { Box, Typography, Divider,Fade } from '@mui/material';



export default function CompanyIntroduction () {
    
    return (
        <section className="section" style={{width:"100%"}}>
           {/*<div className="page-title">Don Give Up!</div>*/}
            <div className="about-page">
      <header className="hero">
       
        <img src="/images/default_img.png" alt="기부 이미지" />
   

        
            <p>믿고 나누는 기부 플랫폼</p>
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

      <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
        주요 기능
      </Typography>
      <ul style={{ paddingLeft: '1.2em' }}>
        <li>✅ 단체의 기부 사업 신청 및 수정</li>
        <li>✅ 관리자의 사업 승인 / 반려 / 삭제 요청 처리</li>
        <li>✅ 기부자들이 확인할 수 있는 사업 정보 열람 기능</li>
        <li>✅ 반려 사유에 대한 피드백 및 개선 기능</li>
        <li>✅ 기부 사업 상태 변경 및 모니터링</li>
      </ul>
  <section className="section">
        <h2>왜 만들었을까요?</h2>
        <br/><br/>
        <p>
          기부에 대한 불신, 정보 부족, 선택의 어려움...  
          Don Give Up!은 기부자가 안심하고 기부할 수 있도록 만든 플랫폼입니다. <br/> <br/>
        

          “당신의 작은 돈(Don)이 누군가에겐 포기하지 않게 하는 힘이 됩니다.”<br/> <br/>

          “희망을 주는 기부, Don Give Up!”
        </p>
</section>
      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#666' }}>
        💬 “소중한 기부가 더 나은 세상을 만드는 출발점이 될 수 있도록,<br />
        우리는 정직하고 따뜻한 연결을 추구합니다.”
      </Typography>
    </Box>

      {/* ...다른 섹션들 */}
    </div>
        </section>

        
    );
}