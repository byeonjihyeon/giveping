package kr.or.iei.biz.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizFile;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.Keyword;
import kr.or.iei.biz.model.dto.SurveyAnswer;
import kr.or.iei.biz.model.dto.SurveyQuestion;
import kr.or.iei.biz.model.service.BizService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;

@RestController
@CrossOrigin("*")
@RequestMapping("/biz")
public class BizController {
	@Autowired
	private BizService service;
	
	@Autowired
	private FileUtil fileUtil;
	
	@Value("${file.uploadPath}")
	private String uploadPath;
	
	
	@GetMapping("/list/{reqPage}")
	@NoTokenCheck // 기부 사업 리스트 조회 : 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectBoardList(@PathVariable int reqPage,
														@RequestParam(required = false) List<String> categories){
		if (categories == null) {
			categories = Collections.emptyList(); // null 방지용 빈 리스트 처리
	    }
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부사업 게시글 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> boardMap = service.selectDonateBizList(reqPage, categories);
			res = new ResponseDTO(HttpStatus.OK, "", boardMap, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 게시물 상세 조회
	@GetMapping("/{bizNo}")
	@NoTokenCheck		// 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectOneDonateBiz(@PathVariable int bizNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 정보 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			Biz biz = service.selectOneDonateBiz(bizNo);
			res = new ResponseDTO(HttpStatus.OK, "", biz, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@PostMapping("/search")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> searchDonateBiz(@RequestBody Keyword keyword){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 검색 결과 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> boardMap = service.searchDonateBiz(keyword);
			res = new ResponseDTO(HttpStatus.OK, "", boardMap, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 회원 예치금 조회하기
	@GetMapping("/donate/{memberNo}")
	public ResponseEntity<ResponseDTO> selectMemberMoney(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 예치금 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			BizMember bizMember = service.selectMemberMoney(memberNo);
			if(bizMember !=null) {
				res = new ResponseDTO(HttpStatus.OK, "", bizMember, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	// 기부하기 (insert -> TBL_DONATION_LIST)
	@PostMapping("/donate")
	public ResponseEntity<ResponseDTO> bizDonate(@RequestBody BizDonationList bizDonationList){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 처리 중, 오류가 발생하였습니다.", false, "error");
		System.out.println("BizDonationList : " +bizDonationList.toString());
		try {
			int result = service.bizDonate(bizDonationList);
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "", true, "");				
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 설문조사 질문 조회
	@GetMapping("/survey")
	public ResponseEntity<ResponseDTO> selectSurveyQuestion(){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "설문조사 질문 조회 중, 오류가 발생하였습니다..", null, "error");
		
		try {
			ArrayList<SurveyQuestion> surveyQuestionList = service.selectSurveyQuestion();
			if(surveyQuestionList !=null) {
				res = new ResponseDTO(HttpStatus.OK, "", surveyQuestionList, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 설문조사 답변 등록
	@PostMapping("/survey")
	public ResponseEntity<ResponseDTO> regSurveyAnswer(@RequestBody List<SurveyAnswer> answerList) throws DuplicateKeyException{
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 처리 중, 오류가 발생하였습니다.", false, "error");
		System.out.println("answerList : " +answerList);
		try {
			int result = service.regSurveyAnswer(answerList);
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "", true, "");				
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	/*
	@PostMapping("/file")
	// 첨부파일 등록 (수정)
	public ResponseEntity<ResponseDTO> regFile (@ModelAttribute MultipartFile [] bizFile, 	// 추가할 첨부파일
												@RequestParam(required = false) int[] delFileNos,	// 삭제할 첨부파일 번호
												@ModelAttribute Biz biz		// 대상 게시글 번호를 담은 객체
												){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "파일 처리 중, 오류가 발생하였습니다.", false, "error");
		System.out.println("bizFile : " +bizFile);
		System.out.println("biz : " +biz.toString());
		System.out.println("delFileNos : " +delFileNos);
		
		
		try {
			
			ArrayList<BizFile> addFileList = new ArrayList<>();
			//첨부파일 업로드 및 추가
			if(bizFile != null) {
				for(int i=0; i<bizFile.length; i++) {
					for (MultipartFile file : bizFile) {
		                String filePath = fileUtil.uploadFile(file, "/biz/board/");
		                BizFile bf = new BizFile();
		                bf.setFileName(file.getOriginalFilename());
		                bf.setFilePath(filePath);
		                bf.setBizNo(biz.getBizNo());	// Biz 객체 안의 bizNo를 저장
		                addFileList.add(bf);
		            }
			}
			}
			
			// 2. 서비스에 위임 (첨부파일 추가 및 삭제 처리)
	        service.updateBizFiles(biz.getBizNo(), addFileList, delFileNos);
			
			res = new ResponseDTO(HttpStatus.OK, "파일이 등록 되었습니다.", true, "success");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	*/
	
	// 특정 기부사업의 첨부파일 리스트 조회
	@GetMapping("/file/{bizNo}")
	@NoTokenCheck // 기부 사업 리스트 조회 : 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectBoardList(@PathVariable int bizNo){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "첨부파일 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<BizFile> bizFileList = service.selectBizFileList(bizNo);
			res = new ResponseDTO(HttpStatus.OK, "", bizFileList, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	
	
}
