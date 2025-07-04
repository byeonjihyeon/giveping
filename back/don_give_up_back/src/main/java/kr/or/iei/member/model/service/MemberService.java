package kr.or.iei.member.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.LoginMember;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.member.model.dto.MemberDonation;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.org.model.dto.Org;

@Service
public class MemberService {
	@Autowired
	private MemberDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private PageUtil pageUtil;
	
	//토큰 재발급
	public String refreshToken(Member member) {
		//accessToken 재발급 처리
		String accessToken = jwtUtils.createMemberAccessToken(member.getMemberNo(), member.getMemberLevel(), member.getMemberName());
		return accessToken;
	}
	
	//아이디 중복체크
	public int chkMemberId(String memberId) {
		return dao.chkMemberId(memberId);
	}
	
	//회원가입
	public int insertMember(Member member) {
		//1) 비밀번호 암호화
		String encodePw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encodePw);
		
		//2) 회원 번호 조회
		int memberNo = dao.selectMemberNo();
		member.setMemberNo(memberNo);
		
		//2) 회원가입
		int result = dao.insertMember(member);
		
		//3) 가입한 회원의 관심 카테고리 등록
		if(result > 0 && member.getCategoryList() != null) {
			DonateCode dc = new DonateCode();
			for(int i=0; i<member.getCategoryList().size(); i++) {
				String code = member.getCategoryList().get(i);
				dc.setDonateCode(code);
				dc.setMemberNo(memberNo);
				dao.insertMemberDonation(dc);
			}
		}
		return result;
	}
	
	//로그인
	public LoginMember memberLogin(Member member) {
		//1) 아이디만을 가지고 회원 정보 조회
		Member chkMember = dao.memberLogin(member.getMemberId()); //회원 번호, 비밀번호, 등급 추출
		
		//2) 평문 비밀번호와 암호화된 비밀번호 비교
		//아이디 잘못 입력하여 chkMember가 null인 경우 비밀번호 검증 불필요
		if(chkMember == null) {
			return null;
		}
		
		if(encoder.matches(member.getMemberPw(), chkMember.getMemberPw())) { //평문 비밀번호 == 암호화 비밀번호
			String accessToken = jwtUtils.createMemberAccessToken(chkMember.getMemberNo(), chkMember.getMemberLevel(), chkMember.getMemberName());
			String refreshToken = jwtUtils.createMemberRefreshToken(chkMember.getMemberNo(), chkMember.getMemberLevel(), chkMember.getMemberName());
			
			//스토리지에 저장되지 않도록 처리(비밀번호 검증 이외에 필요가 없으므로)
			chkMember.setMemberPw(null);
			
			//LoginMember 객체에 저장해서 반환
			LoginMember loginMember = new LoginMember(chkMember, accessToken, refreshToken);
			
			return loginMember;
		}else {
			//평문 비밀번호 != 암호화 비밀번호
			return null;
		}
	}
	
	//회원 상세 조회
	public Member selectMember(int memberNo) {
		
		Member m = dao.selectMember(memberNo);
		m.setMemberPw(null);
		
		return m;
	}
	
	
	//회원 관심카테고리조회
	public List<String> selectCategory(int memberNo) {
		
		return dao.selectCategory(memberNo);
	}
	
	//회원 정보수정 (카테고리 포함)
	public int updateMember(Member updMember, List<String> delCtgList, List<String> addCtgList) {
		
		HashMap<String, Object> paraMap = new HashMap<>();
		paraMap.put("memberNo", updMember.getMemberNo());
		
		
		
		//1. 기존에서 삭제해야할 리스트 제거
		if(delCtgList != null && !delCtgList.isEmpty()) {
			paraMap.put("delCtgList", delCtgList);
			dao.delMemberCategory(paraMap);
			
		}
		
		//2. 관심카테고리 추가
		if(addCtgList != null && !addCtgList.isEmpty()) {
			for(int i=0; i < addCtgList.size(); i++) {
				DonateCode donateCode = new DonateCode();
				donateCode.setDonateCode(addCtgList.get(i));
				donateCode.setMemberNo(updMember.getMemberNo());
				dao.insertMemberDonation(donateCode);
				
			}
		}
		
		//3. 회원정보 수정
		int result = dao.updateMember(updMember);
		
		return result;
		
	}
	
	
	//회원 프로필 파일명(서버에 저장된) 조회
	public String selectProfile(int memberNo) {
		return dao.selectProfile(memberNo);
	}
	
	//회원 프로필(이미지) 초기화
	@Transactional
	public String deleteProfile(int memberNo) {
		
		//기존 파일명 조회
		String prevFilePath = dao.selectProfile(memberNo);
		
		//DB 삭제처리
		int result = dao.deleteProfile(memberNo);
		
		if(result > 0) {
			return prevFilePath;
		}else {
			return null;
		}
		
	}
	
	//회원 프로필(사진) 업데이트
	@Transactional
	public int updateProfile(Member member) {
		return dao.updateProfile(member);
	}
	
	//기존 비밀번호 체크
	public boolean checkPw(Member member) {
		
		//사용자 입력 비밀번호 = 평문, DB의 pw는 암호화된 비밀번호이므로, BCrpyt 메소드사용
		Member chkMember = dao.selectMember(member.getMemberNo());
		
		//기존 비밀번호 일치 결과 (boolean)
		return encoder.matches(member.getMemberPw(), chkMember.getMemberPw());
	}
	
	//회원 비밀번호 변경
	@Transactional
	public int updateMemberPw(Member member) {
		//평문 -> 암호화
		String encodePw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encodePw);
		
		//DB 업데이트
		return dao.updateMemberPw(member);
	}
	
	//회원 탈퇴 -> 회원 탈퇴 여부(0 : 정상, 1 : 탈퇴) -> 회원의 기부 내역을 보존하고자
	@Transactional
	public HashMap<String, Object> deleteMember(int memberNo) {
		
		//1. 서버에 저장된 프로필 사진이 있는지 조회
		String delFileName = dao.selectProfile(memberNo);
		
		//2. 회원 정보 업데이트 member_deleted 0 -> 1, (+ 기존 프로필이 있다면 null 처리)
		int result = dao.deleteMember(memberNo);
		
		HashMap<String, Object> resultMap = new HashMap<>();
		resultMap.put("delFileName", delFileName);	//서버에서 삭제할 파일명
		resultMap.put("result", result);
		
		return resultMap;
		
	}
	
	//회원 관심 단체리스트 조회
	public HashMap<String, Object> selectOrgLikeList(int reqPage, int memberNo) {
		
		int viewCnt = 12;							//한 페이지당 게시글 수
		int pageNaviSize= 5;						//페이지 네비게이션 길이
		int totalCount = dao.selectOrgLikeCnt(memberNo);	//전체 관심단체 수	
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		HashMap<String, Object> paraMap = new HashMap<>();
		paraMap.put("memberNo", memberNo);
		paraMap.put("pageInfo", pageInfo);
		
		//관심단체 목록 (회원번호, 시작번호, 끝번호 전달)
		ArrayList<Org> orgLikeList = dao.selectOrgLikeList(paraMap); 
		
		paraMap.put("orgLikeList", orgLikeList);
		
		//회원번호, 페이지정보(pageInfo), 회원리스트 전달
		return paraMap;
	}
	
	//회원 관심단체 삭제
	@Transactional
	public int delLikeOrg(int orgNo, int memberNo) {
		HashMap<String, Integer> delMap = new HashMap<>();
		delMap.put("orgNo", orgNo);
		delMap.put("memberNo", memberNo);
		
		return dao.delLikeOrg(delMap);
	}


	//내 소식 알림 리스트 조회
	public ArrayList<MemberAlarm> selectAlarmList(int memberNo) {
		return dao.selectAlarmList(memberNo);
	}
	
	//회원 기부내역 조회
	public HashMap<String, Object> selectDonationHistory(int memberNo, int reqPage) {
		
		//1. 페이지네이션
		int viewCnt = 3;		//더보기 클릭시 보여줄 글 수 
		
		//2. 회원의 총 참여 기부수 조회
		int totalCnt = dao.countDonationList(memberNo);
	
		PageInfo pageInfo = pageUtil.getPageInfoVer2(reqPage, viewCnt, totalCnt);
		
		HashMap<String, Object> paraMap = new HashMap<>();
		paraMap.put("memberNo", memberNo);
		if(reqPage > 0) {
			paraMap.put("pageInfo", pageInfo);
		}
		
	    ArrayList<MemberDonation> donationHistory = dao.selectDonationHistory(paraMap);
	    paraMap.put("donationHistory", donationHistory);
	    
		return paraMap;
	}

	// 내 소식 알림 읽음 처리
	public int updateAlarmRead(int alarmNo) {
		return dao.updateAlarmRead(alarmNo);
	}

}
