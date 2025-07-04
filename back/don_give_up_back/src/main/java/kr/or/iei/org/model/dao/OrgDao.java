package kr.or.iei.org.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.org.model.dto.Org;

@Mapper
public interface OrgDao {

	//아이디 중복체크
	int chkOrgId(String orgId);

	//단체 번호 조회
	int selectOrgNo();

	//회원가입
	int insertOrg(Org org);

	//단체 주요 카테고리 등록
	void insertOrgDonation(DonateCode dc);

	//로그인 - 아이디로 회원 조회
	Org orgLogin(String orgId);

	//단체 1개 정보 조회
	Org selectOneOrg(int orgNo);

	//단체 주요 카테고리 조회
	List<String> selectOrgDonation(int orgNo);
	
	//단체 정보 수정
	int updateOrg(Org org);

	//단체 주요 카테고리 삭제
	void deleteOrgDonation(int orgNo);

	//비밀번호 확인
	String checkPw(int orgNo);

	//비밀번호 변경
	int updatePw(Org org);

	//단체 프로필 조회
	String selectThumb(int orgNo);

	//단체 프로필 초기화(삭제)
	int deleteThumb(int orgNo);

	//단체 프로필 수정
	int updateThumb(Org org);

}
