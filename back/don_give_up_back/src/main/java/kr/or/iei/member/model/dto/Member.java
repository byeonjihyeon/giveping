package kr.or.iei.member.model.dto;

import java.util.List;

import kr.or.iei.common.model.dto.DonateCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Member {	
	private int memberNo;				//회원 번호
	private String memberId;			//회원 아이디
	private String memberPw;			//회원 비밀번호
	private String memberName;			//회원 이름
	private String memberPhone;			//회원 전화번호
	private String memberBirth;			//회원 생년월일
	private String memberAddrMain;		//회원 주소
	private String memberAddrDetail;	//회원 상세 주소
	private String memberEmail;			//회원 이메일
	private int memberLevel;			//회원 등급(1:관리자, 2:일반회원)
	private String memberEnrollDate;	//회원 가입일
	private String totalMoney;			//잔액 예치금 (단위를 99,999,999로 표현하기 위해 타입 String)
	private String totalDonateMoney; 	//총 기부금액 (단위를 99,999,999로 표현하기 위해 타입 String)
	private int memberDeleted;			//회원 탈퇴 여부(0:정상, 1:탈퇴)
	private String memberProfile;		//회원 프로필 사진 경로
	private String memberBankCode;		//회원 등록은행(은행명)
	private String memberBankAccount;	//등록 계좌명
	
	
	private List<String> categoryList;				//관심 카테고리 리스트
	private List<MemberDonation> donationHistory;	//기부내역
	private List<Charge> chargeHistory;				//충전내역
	private List<Refund> refundHistory;				//출금내역
	
	private int unreadAlarm;						// 아직 읽지 않은 소식 갯수
	
	private int orgNo;	//관심 단체 번호
}
