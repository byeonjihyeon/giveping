package kr.or.iei.admin.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.common.model.dto.ResponseDTO;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private AdminService service;
	
	//전체 회원 목록 조회
	@GetMapping("/memberManage/{reqPage}")
	public ResponseEntity<ResponseDTO> selectMemberList(@PathVariable int reqPage){
		ResponseDTO res= new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 목록 조회 중,오류가 발생하였습니다",null, "error");
		
		try {
			HashMap<String, Object> memberMap = service.selectMemberList(reqPage);
			res= new ResponseDTO(HttpStatus.OK, "", memberMap,"");
		}catch(Exception e){
			e.printStackTrace();
			
		}
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());

	}
	
	//전체 단체 조회
	@GetMapping("/orgManage/{reqPage}")
	public ResponseEntity<ResponseDTO> selectOrgList(@PathVariable int reqPage){
		ResponseDTO res= new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 목록 조회 중,오류가 발생하였습니다",null, "error");
		
		try {
			HashMap<String, Object> orgMap = service.selectOrgList(reqPage);
			res= new ResponseDTO(HttpStatus.OK, "", orgMap,"");
		}catch(Exception e){
			e.printStackTrace();
			
		}
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
	
}
}
