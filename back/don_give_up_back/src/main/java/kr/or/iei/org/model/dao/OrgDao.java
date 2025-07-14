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

	//탈퇴하기 페이지에서 조회할 기부 사업 리스트
	ArrayList<Biz> selectIngBizList(int orgNo);

	//탈퇴 신청
	int deleteOrg(int orgNo);

	//기부 사업 통계
	//전체 기부 사업 갯수
	int selectAllBiz(int orgNo);
	//미승인 기부 사업 갯수
	int selectNotApproveBiz(int orgNo);
	//반려된 기부 사업 갯수
	int selectRejectBiz(int orgNo);
	//승인된 기부 사업 갯수
	int selectApproveBiz(int orgNo);
	//진행 중인 기부 사업 갯수
	int selectIngBiz(int orgNo);
	//모금 종료된 기부 사업 갯수
	int selectDonateEndBiz(int orgNo);
	//사업 종료된 기부 사업 갯수
	int selectEndBiz(int orgNo);
	//입금 처리된 기부 사업 갯수
	int selectPayEndBiz(int orgNo);
	//카테고리별 기부 사업 갯수
	ArrayList<DonateCode> selectDonateCodeCnt(int orgNo);
	//기부 사업별 모금액
	ArrayList<Biz> selectDonateMoneyList(int orgNo);

	//오늘 모인 기부금
	Biz selectTodayDonate(int orgNo);
	//관심 회원 수
	int selectLikeMember(int orgNo);
	//단체 주요 카테고리명
	List<String> selectOrgCategory(int orgNo);
	//승인된 최근 기부 사업 리스트 5개 조회
	ArrayList<Biz> selectCurrentBizList(int orgNo);

    // 단체 전체 갯수 
	int selectOrgCount();
	//단체 목록 조회 (후원단체 메뉴 눌렀을 때 보이는 단체 목록)
	ArrayList<Org> selectOrgList(HashMap<String, Object> param);

	//진행 중인 기부 사업 리스트
	ArrayList<Biz> selectOrgIngBizList(int orgNo);
	//종료된 기부 사업 리스트
	ArrayList<Biz> selectOrgEndBizList(int orgNo);

 

}
