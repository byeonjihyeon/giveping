package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;

@Service
public class MemberService {
	@Autowired
	private MemberDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
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
			for(int i=0; i<member.getCategoryList().size(); i++) {
				String code = member.getCategoryList().get(i);
				System.out.println(code);
			}
		}
		return 0;
	}
}
