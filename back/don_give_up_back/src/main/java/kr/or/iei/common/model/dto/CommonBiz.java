package kr.or.iei.common.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommonBiz {
	private int bizNo;				// 사업 번호	
	private int orgNo;				// 단체 번호(외래키)
	private String bizName;			// 사업명
	private String donateCode;		// 기부 코드(외래키, tbl_donate_code에서 해당 기부 코드 삭제 이전에 'D99'(기타)로 변경)	
	private String bizContent;		// 사업 내용
	private String bizDonateStart;	//모금 시작 날짜(기부 사업 등록일부터 플러스 7일)
	private String bizDonateEnd;	//모금 종료 날짜(모금 시작 날짜에서 단체가 선택한 30, 60, 90일 플러스)
	private String bizStart;		// 사업 시작 날짜
	private String bizEnd;			// 사업 종료 날짜(react에서 사업 시작 날짜가 사업 종료 날짜보다 늦지 않도록 알림창 띄워주기)
	private int bizGoal;			// 목표 후원 금액
	private int bizStatus;			// 사업 승인 여부(0 : 미확인, 1 : 승인, 2 : 반려, 3 : 삭제 요청, 4 : 삭제)
	private String bizRegDate;		// 사업 신청 검토일자 (사업 승인 여부가 미확인 상태에서, 수정사항이 추가될 경우 해당 칼럼에 sysdate값을 update)
	private String bizEdit;			// 수정 사항(사업 승인 여부 확인 후 수정 사항 있을 경우에만 INSERT)
	private String bizThumbPath;	// 사업 썸네일
	private int bizDonateTerm;		// 모금 기간(30일, 60일, 90일)
	
	
	// join 을 위해 선언한 변수
	private String orgName;	// 사업명
	private String donateCtg;	// 기부 카테고리명
	
	// 모인 기부금 액수
	private int donateMoney;
	
	private String clickBtn;		//단체 페이지 기부 사업 보기에서 선택한 버튼 value
	private String bizEnrollDate;	//사업 등록일
	private int rnum;				//리스트 내 번호
	private String payoutYN;		//입금 여부
}									
