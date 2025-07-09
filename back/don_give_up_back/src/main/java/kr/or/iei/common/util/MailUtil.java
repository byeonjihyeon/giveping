package kr.or.iei.common.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;




@Component


public class MailUtil {
	
	@Autowired
	private JavaMailSender mailSender;
	
	public void sendApproveMail(String to, String bizName, String orgName) {
		String subject ="[Don Give Up] 기부 사업 승인 안내";
		String content =getApproveMailTemplate(bizName, orgName);
		
	try {		
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(content, true);
		
		mailSender.send(message);
		
	}catch(MessagingException e) {
		e.printStackTrace();
	}
}
	
	private String getApproveMailTemplate(String bizName, String orgName) {
        return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2d7ff9;'>[Don Give Up] 기부 사업 승인 안내</h2>"
                + "<p>안녕하세요, <strong>" + orgName + "</strong> 담당자님.</p>"
                + "<p>신청하신 기부 사업 <strong style='color: #333;'>" + bizName + "</strong> 이(가) 검토 후 <span style='color: green; font-weight: bold;'>승인</span>되었습니다.</p>"
                + "<p>기부자들에게 더 나은 기회를 제공해 주셔서 감사합니다.</p>"
                + "<hr style='margin: 20px 0;'/>"
                + "<br/>"
                + "</div>";
    }


	public void sendDelOrgMail(String to, String orgName) {
		String subject ="[Don Give Up] 탈퇴 처리 완료 안내";
		String content =getApproveMailTemplate(orgName);
		
	try {		
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(content, true);
		
		mailSender.send(message);
		
	}catch(MessagingException e) {
		e.printStackTrace();
	}
}

	private String getApproveMailTemplate(String orgName) {
		  return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
	                + "<h2 style='color: #2d7ff9;'>[Don Give Up] 탈퇴 처리 완료 안내</h2>"
	                + "<p>안녕하세요, <strong>" + orgName + "</strong> 담당자님.</p>"
	                + "<p>요청하신 <strong style='color: #333;'> 탈퇴처리</strong>가 검토 후 <span style='color: green; font-weight: bold;'>완료</span>되었습니다.</p>"
	                + "<p>이용해 주셔서 감사합니다.</p>"
	                + "<hr style='margin: 20px 0;'/>"
	                + "<br/>"
	                + "</div>";

}
		
}
