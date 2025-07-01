package kr.or.iei.org.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.LoginOrg;
import kr.or.iei.common.util.JwtUtils;
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

	//아이디 중복체크
	public int chkOrgId(String orgId) {
		return dao.chkOrgId(orgId);
	}

	//회원가입
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

}
