package kr.or.iei.news.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Comment {
	private int commentNo;				// 댓글 번호
	private int memberNo;				// 회원 번호(외래키)
	private int newsNo; 				//소식 번호(외래키)
	private String commentContent;		//댓글 내용
	private String commentTime;			//댓글 작성 시간
	private int commentDeleted;		// 댓글 삭제 여부(0 : 정상, 1 : 삭제) -> 신고된 댓글을 관리자가 처리 전 사용자가 삭제했을 경우 정보를 남겨두기 위해

	// join 을 위한 변수 추가
	private String memberName;
	private String memberId;
	
}
