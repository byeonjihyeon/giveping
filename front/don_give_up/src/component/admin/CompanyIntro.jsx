import { Link } from "react-router-dom";
import Header from "../common/Header";


export default function CompanyIntroduction () {
    
    return (
        <section className="section" style={{width:"100%"}}>
           {/*<div className="page-title">Don Give Up!</div>*/}
            <div className="about-page">
      <header className="hero">
        <h1>Don Give Up!</h1>
        <p>믿고 나누는 기부 플랫폼</p>
      </header>

      <section className="section">
        <h2>왜 만들었을까요?</h2>
        <br/><br/>
        <p>
          기부에 대한 불신, 정보 부족, 선택의 어려움...  
          Don Give Up!은 기부자가 안심하고 기부할 수 있도록 만든 플랫폼입니다. <br/> <br/>
        

          “당신의 작은 돈(Don)이 누군가에겐 포기하지 않게 하는 힘이 됩니다.”<br/> <br/>

          “희망을 주는 기부, Don Give Up!”
        </p>
        <img src="/images/default_img.png" alt="기부 이미지" />
      </section>

      {/* ...다른 섹션들 */}
    </div>
        </section>
    );
}