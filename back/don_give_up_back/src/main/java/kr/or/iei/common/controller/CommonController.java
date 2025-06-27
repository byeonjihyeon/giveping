package kr.or.iei.common.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.model.service.CommonService;

@RestController
@CrossOrigin("*")
public class CommonController {
	@Autowired
	private CommonService service;
	
	//기부 카테고리 조회
	@GetMapping("/donateCtg")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectDonateCtg() {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "카테고리 조회 중 오류가 발생했습니다.", null, "error");
		
		try {
			ArrayList<DonateCode> categoryList = service.selectDonateCtg();
			res = new ResponseDTO(HttpStatus.OK, "", categoryList, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
}
