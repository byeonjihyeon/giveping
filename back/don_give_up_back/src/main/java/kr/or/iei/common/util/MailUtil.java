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
	
	
	// 기부사업 승인 메일 보낼 때 필요한 정보
	public void sendApproveMail(String orgEmail, String bizName, String orgName) {
		String subject ="[Don Give Up] 기부 사업 승인 안내";
		String content =getApproveMailTemplate(bizName, orgName);
		
	try {		
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		
		helper.setTo(orgEmail);
		helper.setSubject(subject);
		helper.setText(content, true);
		
		mailSender.send(message);
		
	}catch(MessagingException e) {
		e.printStackTrace();
	}
}
	// 기부사업 승인 메일 내용
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


	 //기부사업 반려 메일 보낼 때 필요한 정보, 내용
	  public void sendRejectBizMail(String orgEmail, String orgName, String bizName, String bizEdit) {
		 System.out.println("org");
		      try {
		            MimeMessage message = mailSender.createMimeMessage();
		            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		            helper.setTo(orgEmail);
		            helper.setSubject("[Don Give Up] 기부 사업 반려 안내");
		            String content = "<h3>" + orgName + "담당자님</h3>" +
		            
		                             "<p>요청하신 사업 <strong>" + bizName + "</strong>이 아래 사유로 반려되었습니다.</p>" +
		                             "<p><em>" + bizEdit + "</em></p>" +
		                             "<p>반려된 사업은 수정 후 다시 사업등록을 해주셔야 합니다. 문의사항은 관리자에게 문의해주세요.</p>";
		            helper.setText(content, true);

		            mailSender.send(message);
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		    }
	

	// 단체 탈퇴 메일 보낼 때 필요한 정보
	public void sendDelOrgMail(String to, String orgName) {
		String subject ="[Don Give Up] 탈퇴 처리 완료 안내";
		String content =getDeleteMailTemplate(orgName);
		
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
	// 단체 탈퇴 메일 내용
	private String getDeleteMailTemplate(String orgName) {
		  return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
	                + "<h2 style='color: #2d7ff9;'>[Don Give Up] 탈퇴 처리 완료 안내</h2>"
	                + "<p>안녕하세요, <strong>" + orgName + "</strong> 담당자님.</p>"
	                + "<p>요청하신 <strong style='color: #333;'> 탈퇴처리</strong>가 검토 후 <span style='color: green; font-weight: bold;'>완료</span>되었습니다.</p>"
	                + "<p>이용해 주셔서 감사합니다.</p>"
	                + "<hr style='margin: 20px 0;'/>"
	                + "<br/>"
	                + "</div>";
	}

	
	
	//단체 가입 승인 메일 정보
	public void sendApproveOrgMail(String to, String orgName) {
		String subject ="[Don Give Up] 단체 가입 승인 안내";
		String content =getApproveOrgMailTemplate(orgName);
		
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
	//단체 가입 승인 메일 내용
	private String getApproveOrgMailTemplate(String orgName) {
		
	    return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
	    + "<h2 style='color: #2d7ff9;'>[Don Give Up] 단체 가입 승인 안내</h2>"
	    + "<p>안녕하세요, <strong>" + orgName + "</strong> 담당자님.</p>"
	    + "<p><strong style='color: #333;'> 가입 신청</strong> 이 검토 후 <span style='color: green; font-weight: bold;'>승인</span>되었습니다.</p>"
	    + "<p>함께 해주셔서 감사합니다.</p>"
	    + "<hr style='margin: 20px 0;'/>"
	    + "<br/>"
	    + "</div>";
       }
	
	
	//단체 가입 반려 메일
	public void sendRejectOrgMail(String orgEmail, String orgName) {
	      try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	            helper.setTo(orgEmail);
	            helper.setSubject("[Don Give Up] 가입 신청 반려 안내");
	            String content = "<h3>" + orgName + "님</h3>" +
	                             "<p>가입 신청이 반려되었습니다.</p>" ;
	                             
	            helper.setText(content, true);

	            mailSender.send(message);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }

}

