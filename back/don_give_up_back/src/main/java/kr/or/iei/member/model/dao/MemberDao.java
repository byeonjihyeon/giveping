package kr.or.iei.member.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.org.model.dto.Org;

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

	//로그인 - 아이디로 회원 조회
	Member memberLogin(String memberId);
	
	//회원 상세 조회
	Member selectMember(int memberNo);
	
	//회원정보 수정
	int updateMember(Member member);
	
	//회원 관심 카테고리 조회
	List<String> selectCategory(int memberNo);
	
	//프로필 파일명(서버저장용) 조회
	String selectProfile(int memberNo);
	
	//회원 프로필 이미지 삭제
	int deleteProfile(int memberNo);
	
	//회원 프로필 이미지 수정
	int updateProfile(Member member);
	
	//회원 기존 관심에서 제외된 카테고리 삭제
	int delMemberCategory(HashMap<String, Object> paraMap);

	//회원 관심 카테고리 추가
	int insMemberCategory(HashMap<String, Object> paraMap);
	
	//회원 비밀번호 변경
	int updateMemberPw(Member member);
	
	//회원 탈퇴: 탈퇴 여부(0 : 정상, 1 : 탈퇴) -> 회원의 기부 내역을 보존하고자
	int deleteMember(int memberNo);
	
	//회원 관심단체 수 조회
	int selectOrgLikeCnt(int memberNo);
	
	//회원 관심단체 리스트 조회
	ArrayList<Org> selectOrgLikeList(HashMap<String, Object> paraMap);
	
	//회원 관심단체 삭제
	int delLikeOrg(HashMap<String, Integer> delMap);
	

}
