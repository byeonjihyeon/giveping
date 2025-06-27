package kr.or.iei.member.model.dto;

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
	private String memberAddr;			//회원 주소
	private String memberEmail;			//회원 이메일
	private int memberLevel;			//회원 등급(1:관리자, 2:일반회원)
	private String memberEnrollDate;	//회원 가입일
	private int totalMoney;				//잔액 예치금
	private int memberDeleted;			//회원 탈퇴 여부(0:정상, 1:탈퇴)
}
