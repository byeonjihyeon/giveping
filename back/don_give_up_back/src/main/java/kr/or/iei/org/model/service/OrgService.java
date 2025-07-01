package kr.or.iei.org.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.org.model.dao.OrgDao;
import kr.or.iei.org.model.dto.Org;

@Service
public class OrgService {
	@Autowired
	private OrgDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;

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
}
