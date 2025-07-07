package kr.or.iei.common.model.dto;

import java.util.List;

import kr.or.iei.member.model.dto.MemberSurveyAnswer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Alarm {
	
	private int alarmNo;
	private int memberNo;
	private int bizNo;
	private int alarmType;
	private String alarmDate;
	private int alarmRead;
	private int newsNo;
	
	// join 을 위한 변수 선언 
	private String bizName;
	private String orgName;
	
	// 회원별 설문조사 내역 조회
	private List<MemberSurveyAnswer> surveyList;

}
