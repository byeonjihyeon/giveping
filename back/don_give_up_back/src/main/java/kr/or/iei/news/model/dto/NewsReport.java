package kr.or.iei.news.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewsReport {
	
	private int reportNo;			//신고 번호
	private String reportCode;		//신고 코드(외래키) (예 - D01)
	private int commentNo;			//댓글 번호(외래키, 단체 신고면 null)
	private int orgNo;				//단체 번호(외래키, 댓글 신고면 null)
	private int reportMemberNo;		//신고한 회원(외래키)
	private String detailReason;		//상세 신고 사유(not null)
	private int reportDate;			// 신고 날짜
	
	// join을 위해 선언한 변수
	private String reportReason;	// 신고 사유 (신고 코드 한글 ver.) (예 - 난민)
}
