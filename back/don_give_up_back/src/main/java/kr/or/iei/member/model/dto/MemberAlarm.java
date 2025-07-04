package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MemberAlarm {
	private int alarmNo;			//알림 번호
	private int memberNo;			//회원 번호
	private int bizNo;				//사업 번호
	private int newsNo;				//소식 번호
	private int alarmType;			//알림 종류(0 : 사업 종료날(설문조사필수), 1 : 보고서 등 사업 상세 페이지에 첨부파일 업로드 시, 2 : 관심 단체의 소식)
	private String alarmDate;		//알림 시간
	private int alarmRead;			//알림 확인 여부(0 : 미확인, 1 : 확인)
	
	
	// join 을 위한 선언한 변수
	private String bizName;		// 사업명
	private String orgName;		// 단체명
}
