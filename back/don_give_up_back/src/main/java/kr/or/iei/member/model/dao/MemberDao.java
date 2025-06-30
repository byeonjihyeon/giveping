package kr.or.iei.member.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.member.model.dto.Member;

@Mapper
public interface MemberDao {

	//회원 번호 조회
	int selectMemberNo();

	//회원가입
	int insertMember(Member member);


}
