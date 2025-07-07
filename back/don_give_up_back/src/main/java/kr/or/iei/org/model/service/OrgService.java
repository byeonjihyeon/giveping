package kr.or.iei.org.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.LoginOrg;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.org.model.dao.OrgDao;
import kr.or.iei.org.model.dto.Org;

@Service
public class OrgService {
	@Autowired
	private OrgDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;

	//토큰 재발급
	public String refreshToken(Org org) {
		//accessToken 재발급 처리
		String accessToken = jwtUtils.createOrgAccessToken(org.getOrgNo(), org.getOrgName());
		return accessToken;
	}
	
	//아이디 중복체크
	public int chkOrgId(String orgId) {
		return dao.chkOrgId(orgId);
	}

	//회원가입
	@Transactional
	public int insertOrg(Org org) {
		//1) 비밀번호 암호화
		String encodePw = encoder.encode(org.getOrgPw());
		org.setOrgPw(encodePw);
		
		//2) 단체 번호 조회
		int orgNo = dao.selectOrgNo();
		org.setOrgNo(orgNo);
		
		//2) 회원가입
		int result = dao.insertOrg(org);
		
		//3) 가입한 단체의 주요 카테고리 등록
		if(result > 0 && org.getCategoryList() != null) {
			DonateCode dc = new DonateCode();
			for(int i=0; i<org.getCategoryList().size(); i++) {
				String code = org.getCategoryList().get(i);
				dc.setDonateCode(code);
				dc.setOrgNo(orgNo);
				dao.insertOrgDonation(dc);
			}
		}
		return result;
	}

	//로그인
	public LoginOrg orgLogin(Org org) {
		//1) 아이디만을 가지고 회원 정보 조회
		Org chkOrg = dao.orgLogin(org.getOrgId()); //회원 번호, 비밀번호, 등급 추출
		
		//2) 평문 비밀번호와 암호화된 비밀번호 비교
		//아이디 잘못 입력하여 chkOrg가 null인 경우 비밀번호 검증 불필요
		if(chkOrg == null) {
			return null;
		}
		
		if(encoder.matches(org.getOrgPw(), chkOrg.getOrgPw())) { //평문 비밀번호 == 암호화 비밀번호
			String accessToken = jwtUtils.createOrgAccessToken(chkOrg.getOrgNo(), chkOrg.getOrgName());
			String refreshToken = jwtUtils.createOrgRefreshToken(chkOrg.getOrgNo(), chkOrg.getOrgName());
			
			//스토리지에 저장되지 않도록 처리(비밀번호 검증 이외에 필요가 없으므로)
			chkOrg.setOrgPw(null);
			
			//LoginOrg 객체에 저장해서 반환
			LoginOrg loginOrg = new LoginOrg(chkOrg, accessToken, refreshToken);
			
			return loginOrg;
		}else {
			//평문 비밀번호 != 암호화 비밀번호
			return null;
		}
	}

	//단체 1개 정보 조회
	public Org selectOneOrg(int orgNo) {
		Org org = new Org();
		
		//1) tbl_org에서 단체 정보 조회
		org = dao.selectOneOrg(orgNo);
		
		//2) tbl_org_donation에서 단체 주요 카테고리 조회
		List<String> categoryList = dao.selectOrgDonation(orgNo);
		
		org.setCategoryList(categoryList);
		
		return org;
	}

	//단체 정보 수정
	@Transactional
	public int updateOrg(Org org) {
		//1) tbl_org에서 단체 정보 수정
		int result = dao.updateOrg(org);
		
		if(result > 0 && org.getCategoryList() != null) {
		//2) tbl_org_donation에서 기존 단체 주요 카테고리 삭제
			dao.deleteOrgDonation(org.getOrgNo());
		
		//3) tbl_org_donation에서 새로운 단체 주요 카테고리 등록 
			DonateCode dc = new DonateCode();
			for(int i=0; i<org.getCategoryList().size(); i++) {
				String code = org.getCategoryList().get(i);
				dc.setDonateCode(code);
				dc.setOrgNo(org.getOrgNo());
				dao.insertOrgDonation(dc);
			}
		}
		
		return result;
	}

	//비밀번호 확인
	public int checkPw(int orgNo, String orgPw) {
		int result = 0;
		
		//1) 암호화된 비밀번호 가지고 오기
		String encodePw = dao.checkPw(orgNo);
		
		//2) 평문 비밀번호 == 암호화 비밀번호인지 확인
		if(encoder.matches(orgPw, encodePw)) {
			result = 1; //일치하면 결과값 1로 변경
		}
		
		return result;
	}

	//비밀번호 변경
	@Transactional
	public int updatePw(int orgNo, String newOrgPw) {
		//1) 비밀번호 암호화
		String encodePw = encoder.encode(newOrgPw);
		
		//2) 비밀번호 변경
		Org org = new Org();
		org.setOrgNo(orgNo);
		org.setOrgPw(encodePw);
		
		int result = dao.updatePw(org);
		
		return result;
	}

	//단체 프로필 초기화(삭제)
	@Transactional
	public String deleteThumb(int orgNo) {
		//1) 기존 파일명 조회(서버에서 삭제하기 위함)
		String prevFilePath = dao.selectThumb(orgNo);
		
		//2) 단체 프로필 초기화(삭제)
		int result = dao.deleteThumb(orgNo);
		
		if(result > 0) {
			return prevFilePath;
		}else {			
			return null;
		}
	}

	//단체 프로필 수정
	@Transactional
	public int updateThumb(Org org) {
		return dao.updateThumb(org);
	}

	// 단체 알림 리스트 조회
	public ArrayList<MemberAlarm> selectOrgAlarmList(int orgNo) {
		return dao.selectOrgAlarmList(orgNo);
	}

	//단체 알림 읽음 처리
	@Transactional
	public int updateAlarmRead(int alarmNo) {
		return dao.updateAlarmRead(alarmNo);
	}

		
}
