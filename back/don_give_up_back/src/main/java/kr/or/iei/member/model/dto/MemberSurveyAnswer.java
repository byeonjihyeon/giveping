package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MemberSurveyAnswer {
	private int answerNo;			//응답 번호
	private int questionNo;			//문항 번호(외래키)
	private int memberNo;			//회원 번호(외래키)
	private int bizNo;				//사업 번호(외래키)
	private int answerScore;		//응답 점수
	private String answerDate;		//응답 완료 시간
}
