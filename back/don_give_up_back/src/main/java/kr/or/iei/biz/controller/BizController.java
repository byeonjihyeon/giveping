package kr.or.iei.biz.controller;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.BizPlan;
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
	
	// 토스트 에디터 사진 등록
	@PostMapping("/editorImage")
	public ResponseEntity<ResponseDTO> uploadEditorImage(@ModelAttribute MultipartFile image) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "에디터 이미지 업로드 중, 오류가 발생하였습니다.", null, "error");

		try {
			String filePath = fileUtil.uploadFile(image, "/biz/board/editor/");
			// res.resData => "/editor/20250624/20250624151520485_00485.jpg"
			res = new ResponseDTO(HttpStatus.OK, "", "/biz/board/editor/" + filePath.substring(0, 8) + "/" + filePath, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//대표 이미지 등록
	@PostMapping("/thumb")
	public ResponseEntity<ResponseDTO> uploadThumb(@ModelAttribute MultipartFile bizImg, int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "대표 이미지 업로드 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			String filePath = fileUtil.uploadFile(bizImg, "/biz/thumb/");
			
			Biz biz = new Biz();
			biz.setOrgNo(orgNo);
			biz.setBizThumbPath(filePath);
			
			Biz newBiz = service.uploadThumb(biz);
			
			res = new ResponseDTO(HttpStatus.OK, "", newBiz, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//기부 사업 등록
	@PatchMapping("/post")
	public ResponseEntity<ResponseDTO> insertBiz(@RequestBody Biz biz) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 사업 등록 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.insertBiz(biz);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "정상적으로 등록되었습니다.", true, "success");				
			}else {
				res = new ResponseDTO(HttpStatus.OK, "기부 사업 등록 중, 오류가 발생하였습니다.", false, "warning");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
}
