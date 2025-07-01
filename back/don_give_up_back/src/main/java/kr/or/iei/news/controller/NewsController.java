package kr.or.iei.news.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
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
	
	@Value("${file.uploadPath}")
	private String uploadPath;

	@GetMapping("/list/{reqPage}")
	@NoTokenCheck // 기부 사업 리스트 조회 : 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectNewsList(@PathVariable int reqPage) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "소식 조회 중, 오류가 발생하였습니다.", null, "error");

		try {
			HashMap<String, Object> boardMap = service.selectNewsList(reqPage);
			res = new ResponseDTO(HttpStatus.OK, "", boardMap, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	@GetMapping("/{newsNo}")
	@NoTokenCheck // 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectOneNews(@PathVariable int newsNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 정보 조회 중, 오류가 발생하였습니다.", null,
				"error");

		try {
			News news = service.selectOneNews(newsNo);
			res = new ResponseDTO(HttpStatus.OK, "", news, "");
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 단체명으로 단체 번호 찾기 (버튼 클릭 -> 단체 존재 여부 확인)
	@GetMapping("/org/{orgName}")
	@NoTokenCheck // 로그인 필요 x
	public ResponseEntity<ResponseDTO> selectOneNews(@PathVariable String orgName) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 조회 중, 오류가 발생하였습니다.", null, "error");

		try {
			ArrayList<NewsOrg> newsOrgList = service.selectOneOrg(orgName);
			if (newsOrgList != null) {
				res = new ResponseDTO(HttpStatus.OK, "", newsOrgList, "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 게시글 등록하기
	@PostMapping
	@NoTokenCheck // 로그인 필요함.. 임시로 어노테이션 등록 (테스트용)
	public ResponseEntity<ResponseDTO> insertNews(@ModelAttribute MultipartFile newsThumb, // 썸네일 파일 객체
			@ModelAttribute News news) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 게시글 정보 조회 중, 오류가 발생하였습니다.", null,
				"error");

		try {
			// 썸네일 파일 업로드
			if (newsThumb != null) { // 썸네일 파일 업로드 안한경우 form에 append 해주지 않음. 이 때 boardThumb에는 null이 들어있음.
				String filePath = fileUtil.uploadFile(newsThumb, "/news/thumb/"); // 업로드한 파일명
				news.setNewsThumbPath(filePath);
			}

			// DB에 게시글 정보 등록
			int result = service.insertNews(news);

			res = new ResponseDTO(HttpStatus.OK, "게시글이 등록 되었습니다.", true, "success");

		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 토스트 에디터 사진 등록
	@PostMapping("/editorImage")
	@NoTokenCheck // 임시
	public ResponseEntity<ResponseDTO> uploadEditorImage(@ModelAttribute MultipartFile image) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "에디터 이미지 업로드 중, 오류가 발생하였습니다.", null,
				"error");

		try {
			String filePath = fileUtil.uploadFile(image, "/news/board/");
			// res.resData => "/editor/20250624/20250624151520485_00485.jpg"
			res = new ResponseDTO(HttpStatus.OK, "", "/news/board/" + filePath.substring(0, 8) + "/" + filePath, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	@PatchMapping
	@NoTokenCheck // 임시
	public ResponseEntity<ResponseDTO> updateNews(@ModelAttribute MultipartFile newsThumb, // 새 썸네일 파일 객체
													@ModelAttribute News news, // 소식글 번호, 제목, 내용, 삭제 파일 번호 배열
													String prevThumbPath){ // 기존 썸네일 이미지 파일명
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "소식 글 수정 중, 오류가 발생하였습니다.", false, "error");

		try {
			// 추가 썸네일 업로드 시
			if (newsThumb != null) {
				String filePath = fileUtil.uploadFile(newsThumb, "/news/thumb/"); // 썸네일 파일 업로드
				news.setNewsThumbPath(filePath); // DB에 저장 파일명 업데이트를 위함.

				// 게시글 등록 시, 썸네일 이미지를 업로드 하지 않았을 수 있으므로 null이 아닐 때 처리
				if (prevThumbPath != null) {
					String savePath = uploadPath + "/news/thumb/";
					File file = new File(savePath + prevThumbPath.substring(0, 8) + File.separator + prevThumbPath);

					if (file.exists()) {
						file.delete();
					}
				}
			}
			
			int result = service.updateNews(news); // 업데이트 로직

			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "게시글이 정상적으로 수정 되었습니다.", true, "success");				
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@DeleteMapping("/{newsNo}")
	@NoTokenCheck // 임시
	public ResponseEntity<ResponseDTO> deleteNews(@PathVariable int newsNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "소식글 삭제 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			//DB 게시글, 파일 정보 삭제
			News delnews = service.deleteNews(newsNo);
			
			if(delnews != null) {
				//썸네일 파일 삭제
				if(delnews.getNewsThumbPath() != null) {
					String savePath = uploadPath + "/news/thumb/" + delnews.getNewsThumbPath().substring(0, 8) + File.separator + delnews.getNewsThumbPath();
					File file = new File(savePath);
					if(file.exists()) {
						file.delete();
					}
				}
				
				//에디터 이미지 제거
				String regExp = "<img[^>]*src=[\"']([^\"']+)[\"'][^>]*>"; //<img> 태그에서 src 속성을 추출하기 위한 정규표현식
				Pattern pattern = Pattern.compile(regExp);
				Matcher matcher = pattern.matcher(delnews.getNewsContent()); 
				
				while(matcher.find()) {
					String imageUrl = matcher.group(1); // 예) http://localhost:9999/news/board/20250624/20250624162600775_04771.jpg
					
					String filePath = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // 20250624162600775_04771.jpg
					String savePath = uploadPath + "/news/board/" + filePath.substring(0, 8) + File.separator;
					
					File file = new File(savePath + filePath);
					if(file.exists()) {
						file.delete();
					}
				}
				
				res = new ResponseDTO(HttpStatus.OK, "소식이 삭제 되었습니다.", true, "success");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	

}
