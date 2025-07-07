package kr.or.iei.org.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizPlan;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.LoginOrg;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.org.model.dto.Org;
import kr.or.iei.org.model.service.OrgService;

@RestController
@CrossOrigin("*")
@RequestMapping("/org")
public class OrgController {
	@Autowired
	private OrgService service;

	@Autowired
	private FileUtil fileUtil;
	
	@Value("${file.uploadPath}")
	private String uploadPath;
	
	//토큰 재발급
	@PostMapping("/refresh")
	public ResponseEntity<ResponseDTO> refreshToken(@RequestBody Org org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "토근 재발급 실패", null, "error");
		
		try {
			String reAccessToken = service.refreshToken(org);
			
			//accessToken 재발급 완료
			res = new ResponseDTO(HttpStatus.OK, "", reAccessToken, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//아이디 중복체크
	@GetMapping("/{orgId}/chkId")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> chkOrgId(@PathVariable String orgId){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중 오류가 발생했습니다.", false, "error");
		
		try {
			int count = service.chkOrgId(orgId);
			
			res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원가입
	@PostMapping("/join")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> insertOrg(@RequestBody Org org){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중 오류가 발생했습니다.", false, "error");
		
		try {
			int result = service.insertOrg(org);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "회원가입 중 오류가 발생했습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//로그인
	@PostMapping("/login")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> orgLogin(@RequestBody Org org){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중 오류가 발생했습니다.", null, "error");
		try {
			LoginOrg loginOrg = service.orgLogin(org);
			
			if(loginOrg == null) {
				res = new ResponseDTO(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요", null, "warning");
			}else {				
				res = new ResponseDTO(HttpStatus.OK, "", loginOrg, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 1개 정보 조회
	@GetMapping("/{orgNo}")
	public ResponseEntity<ResponseDTO> selectOneOrg(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 정보 조회 중 오류가 발생했습니다.", null, "error");
		
		try {
			Org org = service.selectOneOrg(orgNo);
			
			if(org != null) {
				res = new ResponseDTO(HttpStatus.OK, "", org, "");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "단체 정보 조회 중 오류가 발생했습니다.", null, "wraning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 정보 수정
	@PatchMapping("/update")
	public ResponseEntity<ResponseDTO> updateOrg(@RequestBody Org org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 정보 수정 중 오류가 발생했습니다.", false, "error");
		
		try {
			int result = service.updateOrg(org);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "정상적으로 수정되었습니다.", true, "success");
			}else {				
				res = new ResponseDTO(HttpStatus.OK, "단체 정보 수정 중 오류가 발생했습니다.", false, "warning");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	

	//단체 주요 카테고리 조회
	@GetMapping("/category/{orgNo}")
	public ResponseEntity<ResponseDTO> selectOrgCategories(@PathVariable int orgNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "", fileUtil, uploadPath);
		System.out.println(orgNo);
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}	

	//비밀번호 확인
	@PostMapping("/chkPw/{orgNo}/{orgPw}")
	public ResponseEntity<ResponseDTO> checkPw(@PathVariable int orgNo, @PathVariable String orgPw) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 확인 중 오류가 발생했습니다.", false, "error");

		try {
			int result = service.checkPw(orgNo, orgPw);
			
			if(result > 0) {				
				res = new ResponseDTO(HttpStatus.OK, "비밀번호가 확인되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "비밀번호가 일치하지 않습니다.", false, "warning");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//비밀번호 변경
	@PostMapping("/updPw/{orgNo}/{newOrgPw}")
	public ResponseEntity<ResponseDTO> updatePw(@PathVariable int orgNo, @PathVariable String newOrgPw) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 변경 중 오류가 발생했습니다.", false, "error");
		
		try {
			int result = service.updatePw(orgNo, newOrgPw);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "비밀번호가 변경되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "비밀번호 변경 중 오류가 발생했습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

	}

	//단체 프로필 초기화(삭제)
	@PatchMapping("/thumb/{orgNo}")
	public ResponseEntity<ResponseDTO> deleteThumb(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 초기화 중 오류가 발생했습니다.", false, "error");
		
		try {
			String prevFilePath = service.deleteThumb(orgNo); //prevFilePath : 서버에 저장된 기존 파일
			
			if(prevFilePath != null) {
				String savePath = uploadPath + "/org/thumb/";
				File delFile = new File(savePath + prevFilePath.substring(0, 8) + File.separator + prevFilePath);
				
				if(delFile.exists()) {
					delFile.delete();
				}
				
				res = new ResponseDTO(HttpStatus.OK, "기본 프로필로 변경되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "프로필 초기화 중 오류가 발생했습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 프로필 수정
	@PostMapping("/thumb")
	public ResponseEntity<ResponseDTO> updateThumb(@ModelAttribute MultipartFile profile, int orgNo, String orgThumbPath) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 수정 중 오류가 발생했습니다.", null, "error");
		
		try {
			String filePath = fileUtil.uploadFile(profile, "/org/thumb/");
			
			Org org = new Org();
			org.setOrgNo(orgNo);
			org.setOrgThumbPath(filePath);
			
			int result = service.updateThumb(org);
			
			if(result > 0) {
				if(orgThumbPath != null) {
					String savePath = uploadPath + "/org/thumb/";
					File delFile = new File(savePath + orgThumbPath.substring(0, 8) + File.separator + orgThumbPath);
					
					if(delFile.exists()) {
						delFile.delete();
					}
				}
				
				res = new ResponseDTO(HttpStatus.OK, "정상적으로 수정되었습니다.", filePath, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "프로필 수정 중 오류가 발생했습니다.", null, "warning");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
   //기부 사업 리스트
   @GetMapping("/bizList/{orgNo}/{clickBtn}/{reqPage}")
   public ResponseEntity<ResponseDTO> selectBizList(@PathVariable int orgNo, @PathVariable String clickBtn, @PathVariable int reqPage) {
      ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 사업 조회 중 오류가 발생했습니다.", null, "error");
      
      try {
         Biz biz = new Biz();
         biz.setOrgNo(orgNo);
         biz.setClickBtn(clickBtn);
         
         HashMap<String, Object> bizMap = service.selectBizList(reqPage, biz);
         
         res = new ResponseDTO(HttpStatus.OK, "", bizMap, "");
      }catch(Exception e) {
         e.printStackTrace();
      }
      
      return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
   }
	
}
