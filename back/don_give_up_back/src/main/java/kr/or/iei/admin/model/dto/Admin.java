package kr.or.iei.admin.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Admin {
	
	    //회원변수
		private int memberNo;				//회원 번호
		private String memberId;			//회원 아이디
		private String memberPw;			//회원 비밀번호
		private String memberName;			//회원 이름
		private String memberPhone;			//회원 전화번호
		private String memberBirth;			//회원 생년월일
		private String memberAddr;			//회원 주소
		private String memberEmail;			//회원 이메일
		private int memberLevel;			//회원 등급(1:관리자, 2:일반회원)
		private String memberEnrollDate;	//회원 가입일
		private int totalMoney;				//잔액 예치금
		private int memberDeleted;			//회원 탈퇴 여부(0:정상, 1:탈퇴)
		
		
		//단체변수
		private int orgNo;				//단체 번호
		private String orgId;			//단체 아이디
		private String orgPw;			//단체 비밀번호
		private String orgName;			//단체명
		private String orgBiznum;		//단체 사업자 번호
		private String orgPhone;		//단체 전화번호
		private String orgEmail;		//단체 이메일
		private String orgAddr;			//단체 주소
		private String orgIntroduce;	//단체 설명
		private String orgAccount;		//단체 계좌번호
		private String orgAccountBank;	//단체 계좌번호 은행명
		private String orgEnrollDate;	//단체 가입일
		private double orgTemperature;	//단체 온도
		private int orgStatus;			//단체 상태(0:미승인, 1:승인, 2:반려, 3:탈퇴요청, 4:탈퇴)
		private String orgThumb;		//단체 썸네일 경로
		
		
	}

