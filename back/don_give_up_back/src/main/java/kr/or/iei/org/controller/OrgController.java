package kr.or.iei.org.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizPlan;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.aop.ValidateAOP;
import kr.or.iei.common.model.dto.LoginOrg;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.news.model.dto.NewsReport;
import kr.or.iei.org.model.dto.Org;
import kr.or.iei.org.model.service.OrgService;

@RestController
@CrossOrigin("*")
@RequestMapping("/org")
public class OrgController {

    private final ValidateAOP validateAOP;
	@Autowired
	private OrgService service;

	@Autowired
	private FileUtil fileUtil;
	
	@Value("${file.uploadPath}")
	private String uploadPath;

    OrgController(ValidateAOP validateAOP) {
        this.validateAOP = validateAOP;
    }
	
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
				res = new ResponseDTO(HttpStatus.OK, "회원가입이 완료되었습니다. 관리자 승인 결과는 메일로 발송됩니다.", true, "success");
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
				if(loginOrg.getOrg().getOrgStatus() == 1 || loginOrg.getOrg().getOrgStatus() == 3) {					
					res = new ResponseDTO(HttpStatus.OK, "", loginOrg, "");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "관리자 승인이 되지 않았습니다.", null, "warning");
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 1개 정보 조회
	@GetMapping("/{orgNo}")
	@NoTokenCheck
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
				res = new ResponseDTO(HttpStatus.OK, "", true, "");
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
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}	

	//비밀번호 확인
	@PostMapping("/chkPw")
	public ResponseEntity<ResponseDTO> checkPw(@RequestBody Org org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 확인 중 오류가 발생했습니다.", false, "error");

		try {
			int result = service.checkPw(org);
			
			if(result > 0) {				
				res = new ResponseDTO(HttpStatus.OK, "", true, "");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "", false, "");
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

	
	//단체 프로필 수정
	@PostMapping("/thumb")
	public ResponseEntity<ResponseDTO> updateThumb(@ModelAttribute MultipartFile profile, int orgNo, boolean isDefault, String prevProfile) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 수정 중 오류가 발생했습니다.", null, "error");
		
		try {
			if(profile == null) { //대표 사진을 변경하지 않았을 때 or 기본 이미지로 변경했을 때
				//기본 이미지로 변경했을 때 기존 대표 사진 삭제
				if(isDefault) { //기본 이미지 변경했을 때
					int result = service.deleteThumb(orgNo);
					
					if(result > 0) {						
						if(prevProfile != null) { //기존 대표 사진이 존재할 때
							String savePath = uploadPath + "/org/thumb/";
							File delFile = new File(savePath + prevProfile.substring(0, 8) + File.separator + prevProfile);
							
							if(delFile.exists()) {
								delFile.delete();
							}
						}
					}
					res = new ResponseDTO(HttpStatus.OK, "정상적으로 수정되었습니다.", null, "success");
				}else { //대표 사진을 변경하지 않았을 때
					res = new ResponseDTO(HttpStatus.OK, "정상적으로 수정되었습니다.", prevProfile, "success");
				}
			}else { //대표 사진을 변경했을 때
				String filePath = fileUtil.uploadFile(profile, "/org/thumb/");
				
				Org org = new Org();
				org.setOrgNo(orgNo);
				org.setOrgThumbPath(filePath);
				
				int result = service.updateThumb(org);
				
				//기존 대표 사진 삭제
				if(result > 0) {
					if(prevProfile != null) { //기존 대표 사진이 존재할 때
						String savePath = uploadPath + "/org/thumb/";
						File delFile = new File(savePath + prevProfile.substring(0, 8) + File.separator + prevProfile);
						
						if(delFile.exists()) {
							delFile.delete();
						}
					}
					res = new ResponseDTO(HttpStatus.OK, "정상적으로 수정되었습니다.", filePath, "success");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "프로필 수정 중 오류가 발생했습니다.", null, "warning");
				}	
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
   
	//단체 아이디 찾기
	@PostMapping("/searchId")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectOrgId(@RequestBody Org org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			String orgId = service.selectOrgId(org);
			
			if(orgId != null) {
				int idLength = orgId.length();
				String first = orgId.substring(0,2);
				String last = orgId.substring(idLength-2);
				String marker = "*".repeat(idLength-4);
				orgId = first + marker + last;
				
				res = new ResponseDTO(HttpStatus.OK, "아이디 : " + orgId, true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "단체명 또는 전화번호가 일치하지 않습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 단체별 알림 리스트 조회
	@GetMapping("/alarm/{orgNo}")
	public ResponseEntity<ResponseDTO> selectOrgAlarmList(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "알림 조회 중, 오류가 발생하였습니다.", null, "error");

		try {
			ArrayList<MemberAlarm> alarmList = service.selectOrgAlarmList(orgNo);

			res= new ResponseDTO(HttpStatus.OK, "", alarmList , uploadPath);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

// 알림 클릭 시, 알림 읽음 표시로 업데이트
@PatchMapping("/alarm/{alarmNos}")
public ResponseEntity<ResponseDTO> updateAlarmRead(@PathVariable String alarmNos){
	ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "알림 읽음 처리 중, 오류가 발생하였습니다.", false, "error");
	
	try{
		String[] alarmNoArr = alarmNos.split(",");
        int updateCount = 0;
        for (String alarmNoStr : alarmNoArr) {
            int alarmNo = Integer.parseInt(alarmNoStr.trim());
            updateCount += service.updateAlarmRead(alarmNo);
        }
		
		if(updateCount > 0) {
			res = new ResponseDTO(HttpStatus.OK, "", true, "");
		}else {
			res = new ResponseDTO(HttpStatus.OK, "", false, "");
		}
		
	}catch(Exception e){
		e.printStackTrace();
	}
	
	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
}
	

	//단체 비밀번호 찾기
	@PostMapping("/searchPw")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectOrgPw(@RequestBody Org org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.selectOrgPw(org);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "이메일로 임시 비밀번호를 전송했습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "아이디 또는 이메일이 일치하지 않습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//탈퇴하기 페이지에서 조회할 기부 사업 리스트
	@GetMapping("/bizList/{orgNo}")
	public ResponseEntity<ResponseDTO> selectIngBizList(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 사업 리스트 조회 중 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<Biz> bizList = service.selectIngBizList(orgNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", bizList, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//탈퇴 신청
	@PatchMapping("/delete/{orgNo}")
	public ResponseEntity<ResponseDTO> deleteOrg(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기부 사업 리스트 조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.deleteOrg(orgNo);
			
			res = new ResponseDTO(HttpStatus.OK, "탈퇴 신청이 완료되었습니다.", true, "success");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//기부 사업 통계
	@GetMapping("/data/{orgNo}")
	public ResponseEntity<ResponseDTO> selectBizData(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "통계 조회 중 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> bizMap = service.selectBizData(orgNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", bizMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 마이페이지 메인에 보여질 정보 조회
	@GetMapping("/main/{orgNo}")
	public ResponseEntity<ResponseDTO> selectOrgMain(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "정보 조회 중 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> orgMap = service.selectOrgMain(orgNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", orgMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 목록 조회 (후원단체 메뉴 클릭 시)
	@NoTokenCheck
	@PostMapping("/organization/list")
	public ResponseEntity<ResponseDTO> selectOrgList(@RequestBody Org data) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 목록 조회 중 오류가 발생하였습니다.", null, "error");

		try {
			 
			HashMap<String, Object> orgMap = service.selectOrgList(data);
					
			res = new ResponseDTO(HttpStatus.OK, "", orgMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//단체 상세페이지
	@GetMapping("/view/{orgNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectOrgView(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "단체 목록 조회 중 오류가 발생하였습니다.", null, "error");
		
		try {
			
			HashMap<String, Object> orgMap = service.selectOrgView(orgNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", orgMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//탈퇴취소하기
	@PatchMapping("/deleteCancel/{orgNo}")
	public ResponseEntity<ResponseDTO> deleteCancel(@PathVariable int orgNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "탈퇴취소 중 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.deleteCancel(orgNo);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "탈퇴취소 되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "탈퇴취소 중 오류가 발생하였습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

}
