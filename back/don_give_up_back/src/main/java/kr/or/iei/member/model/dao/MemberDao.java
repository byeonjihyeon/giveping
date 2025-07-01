package kr.or.iei.member.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.member.model.dto.Member;

@Mapper
public interface MemberDao {

	//아이디 중복체크
	int chkMemberId(String memberId);
	
	//회원 번호 조회
	int selectMemberNo();

	//회원가입
	int insertMember(Member member);

	//회원 관심 카테고리 등록
	void insertMemberDonation(DonateCode dc);

}
