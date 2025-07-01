package kr.or.iei.news.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.news.model.dto.News;
import kr.or.iei.news.model.dto.NewsFile;
import kr.or.iei.news.model.dto.NewsOrg;
import kr.or.iei.news.model.service.NewsService;

@RestController
@CrossOrigin("*")
@RequestMapping("/news")
public class NewsController {
	@Autowired
	private NewsService service;
	
	@Autowired
	private FileUtil fileUtil;
	
	@GetMapping("/list/{reqPage}")
	@NoTokenCheck // 기부 사업 리스트 조회 : 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectNewsList(@PathVariable int reqPage){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "소식 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> boardMap = service.selectNewsList(reqPage);
			res = new ResponseDTO(HttpStatus.OK, "", boardMap, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@GetMapping("/{newsNo}")
	@NoTokenCheck		// 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectOneNews(@PathVariable int newsNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 정보 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			News news = service.selectOneNews(newsNo);
			res = new ResponseDTO(HttpStatus.OK, "", news, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 단체명으로 단체 번호 찾기 (버튼 클릭 -> 단체 존재 여부 확인)
	@GetMapping("/org/{orgName}")
	@NoTokenCheck		// 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectOneNews(@PathVariable String orgName){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<NewsOrg> newsOrgList = service.selectOneOrg(orgName);
			if(newsOrgList != null) {
				res = new ResponseDTO(HttpStatus.OK, "", newsOrgList, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 게시글 등록하기
	@PostMapping
	@NoTokenCheck		// 로그인 필요함..  임시로 어노테이션 등록 (테스트용)
	public ResponseEntity<ResponseDTO> insertNews(@ModelAttribute MultipartFile newsThumb,		//썸네일 파일 객체
										            @ModelAttribute News news){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 정보 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			//썸네일 파일 업로드
			if(newsThumb != null) { //썸네일 파일 업로드 안한경우 form에 append 해주지 않음. 이 때 boardThumb에는 null이 들어있음.
				String filePath = fileUtil.uploadFile(newsThumb, "/news/thumb/"); //업로드한 파일명
				news.setNewsThumbPath(filePath);
			}
			
			//DB에 게시글 정보 등록
			int result = service.insertNews(news);
			
			res = new ResponseDTO(HttpStatus.OK, "게시글이 등록 되었습니다.", true, "success");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 토스트 에디터 사진 등록
	@PostMapping("/editorImage")
	@NoTokenCheck		// 임시
	public ResponseEntity<ResponseDTO> uploadEditorImage(@ModelAttribute MultipartFile image){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "에디터 이미지 업로드 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			String filePath = fileUtil.uploadFile(image, "/news/board/");
			//res.resData => "/editor/20250624/20250624151520485_00485.jpg" 
			res = new ResponseDTO(HttpStatus.OK, "", "/news/board/" + filePath.substring(0, 8) + "/" + filePath, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
}
