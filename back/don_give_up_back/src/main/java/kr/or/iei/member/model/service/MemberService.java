package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.LoginMember;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;

@Service
public class MemberService {
	@Autowired
	private MemberDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
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


}
