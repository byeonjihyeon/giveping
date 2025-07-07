package kr.or.iei.org.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.member.model.dto.MemberAlarm;
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

	//기부 사업 갯수 조회
	int selectBizCount(Biz biz);

	//기부 사업 리스트 조회
	ArrayList<Biz> selectBizList(HashMap<String, Object> param);

	//단체 아이디 찾기
	String selectOrgId(Org org);

	//단체 비밀번호 찾기
	int selectOrgPw(Org org);

	//임시 비밀번호로 변경
	void updateRandomPw(Org org);
	//단체 알림 리스트 조회
	ArrayList<MemberAlarm> selectOrgAlarmList(int orgNo);

	//단체 알림 읽음 처리
	int updateAlarmRead(int alarmNo);

}
