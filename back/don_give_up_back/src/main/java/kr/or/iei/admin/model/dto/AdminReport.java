package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminReport {
	
     private int reportNo;
     private String reportCode;
     private int commentNo;
     private int orgNo;
     private int reportMemberNo;
     private String reportDetailReason;
     private String reportDate;
     
     private String memberName;
     private String orgName;
     private String commentContent;
     private String reportReason;
     private int newsNo;
     
     
   //신고 내역 조회에서 필요한 것
     //댓글 삭제여부 변수
     private int commentDeleted;
     //단체 상태 
     private int orgStatus;
}
