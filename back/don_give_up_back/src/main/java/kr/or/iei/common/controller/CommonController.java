package kr.or.iei.common.controller;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.CommonBiz;
import kr.or.iei.common.model.dto.CommonOrg;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.model.service.CommonService;
import kr.or.iei.news.model.dto.News;

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
	
	// 일반/단체회원 별 안 읽은 알람 수 조회
	@GetMapping("/countAlarm")
	public ResponseEntity<ResponseDTO> countAlarm(@RequestParam Map<String, Object> param){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "알림 조회 중 오류 발생", null, "error");
		try {
			int countAlarm = service.countAlarm(param);
			res = new ResponseDTO(HttpStatus.OK, "", countAlarm, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	// 일반회원 관심 카테고리에 따라서 기부 사업 리스트 조회 (로그인 x시 or 단체 회원일 경우 => memberNo 를 0으로 보냄-> 기부 종료일 임박한 순서대로 리스트 조회)
	@GetMapping("/bizList/{primaryNo}")
	//@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectMainBizList(@PathVariable int primaryNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 사업 리스트 조회 중 오류 발생", null, "error");
		try {
			ArrayList<CommonBiz> bizList = service.selectMainBizList(primaryNo);
			res = new ResponseDTO(HttpStatus.OK, "", bizList, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 일반회원 관심 카테고리에 따라서 기부 사업 리스트 조회 (로그인 x 시 or 단체 회원일 경우 => memberNo 를 0으로 보냄)
	@GetMapping("/orgList/{primaryNo}")
	public ResponseEntity<ResponseDTO> selectMainOrgList(@PathVariable int primaryNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 단체 리스트 조회 중 오류 발생", null, "error");
		try {
			ArrayList<CommonOrg> orgList = service.selectMainOrgList(primaryNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", orgList, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//총 기부금액 조회
	@GetMapping("/donationAmount")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectDonationAmount(){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부금 조회 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			String amount = service.selectDonationAmount();
			
			res = new ResponseDTO(HttpStatus.OK, "", amount, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//메인페이지에 들어갈 소식 조회(최신순으로)
	@GetMapping("/mainNews")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectMainNews(){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "소식 조회 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			ArrayList<News> mainNewsList = service.selectMainNews();
			
			res = new ResponseDTO(HttpStatus.OK, "", mainNewsList, "");

		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
}
