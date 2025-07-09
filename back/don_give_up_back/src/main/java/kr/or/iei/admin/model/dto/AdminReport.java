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
     
     
}
