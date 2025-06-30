package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping("/member")
public class MemberController {
	@Autowired
	private MemberService service;
	
	@PostMapping("/join")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> insertMember(@RequestBody Member member){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중 오류가 발생했습니다.", false, "error");
		
		try {
			int result = service.insertMember(member);
			
			res = new ResponseDTO(HttpStatus.OK, "", true, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
}
