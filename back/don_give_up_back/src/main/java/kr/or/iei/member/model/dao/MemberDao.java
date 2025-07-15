package kr.or.iei.member.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.member.model.dto.MemberDonation;
import kr.or.iei.member.model.dto.MemberSurveyAnswer;
import kr.or.iei.member.model.dto.Refund;
import kr.or.iei.member.model.dto.Wallet;
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
	Member selectMember(HashMap<String, Integer> memberMap);
	
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

	//회원별 알림 리스트 조회
	ArrayList<MemberAlarm> selectAlarmList(int memberNo);
	
	//회원 관심단체 수 조회
	int selectOrgLikeCnt(int memberNo);
	
	//회원 관심단체 리스트 조회
	ArrayList<Org> selectOrgLikeList(HashMap<String, Object> paraMap);
	
	//회원 관심단체 삭제
	int delLikeOrg(HashMap<String, Integer> delMap);

	// 알림 읽음 처리
	int updateAlarmRead(int alarmNo);
	
	//회원 총 기부수 조회
	int countDonationList(HashMap<String, Object> paraMap);
	
	//회원 기부리스트 조회
	ArrayList<MemberDonation> selectDonationHistory(HashMap<String, Object> paraMap);

	//회원기부내역 조회
	ArrayList<MemberDonation> selectDonationHistory(int memberNo);
	
	//회원 결제, 출금내역 건수 조회
	int countWalletHistory(HashMap<String, Object> walletMap);
	
	//회원 결제, 출금내역 조회
	ArrayList<Wallet> selectWallectHistory(HashMap<String, Object> walletMap);

	//회원 설문조사 내역 조회
	ArrayList<MemberSurveyAnswer> selectSurveyHistory(int memberNo);
	
	//회원 충전하기 버튼 클릭시, 주문번호 미리 생성 및 금액 입력 + 회원번호 가져오기
	int charge(HashMap<String, Object> memberMap);

	//회원 인증계좌 업데이트
	int updateMemberAccount(Member member);
	
	//환불 신청하기
	int refund(HashMap<String, Object> refundMap);
	

	//회원 아이디 찾기
	String selectMemberId(Member member);


	//회원 비밀번호 찾기
	int selectMemberPw(Member member);

	//임시 비밀번호로 변경
	void updateRandomPw(Member member);
	
	//주문번호 미리 생성 및 결제할 금액 저장
	int insertOrder(HashMap<String, Object> orderMap);
	
	//결제 실패시, 미리 생성한 주문번호 행 지우기
	void deleteCharge(String orderId);
	
	//회원 관심카테고리와 일치하는 단체 조회
	List<String> selecOrgList(List<String> categories);
	
	//회원 관심카테고리를 가진 단체와 일치하는 사업 조회
	List<Biz> selectRecommandBizList(List<String> orgList);
	
	//환불요청중인 리스트 조회
	ArrayList<Refund> selectRefundList(int memberNo);

	//관심 단체 추가
	int addLikeOrg(Member member);

	//관심 단체 삭제
	int deleteLikeOrg(Member member);

	//관심 단체 조회
	ArrayList<Member> selectLikeOrg(int memberNo);
	
}
