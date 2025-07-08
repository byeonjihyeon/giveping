package kr.or.iei.member.controller;

import java.io.File;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.LoginMember;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.member.model.dto.MemberDonation;
import kr.or.iei.member.model.dto.MemberSurveyAnswer;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.dto.UpdateMember;
import kr.or.iei.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping("/member")
public class MemberController {
	@Autowired
	private MemberService service;

	@Autowired
	private FileUtil fileUtil;
	
	@Value("${file.uploadPath}")
	private String uploadPath;

	//토큰 재발급
	@PostMapping("/refresh")
	public ResponseEntity<ResponseDTO> refreshToken(@RequestBody Member member) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "토근 재발급 실패", null, "error");
		
		try {
			String reAccessToken = service.refreshToken(member);
			
			//accessToken 재발급 완료
			res = new ResponseDTO(HttpStatus.OK, "", reAccessToken, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	
	//아이디 중복 체크
	@GetMapping("/{memberId}/chkId")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> chkMemberId(@PathVariable String memberId) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중 오류가 발생했습니다.", false, "error");
		
		try {
			int count = service.chkMemberId(memberId);
			
			res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원가입
	@PostMapping("/join")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> insertMember(@RequestBody Member member){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중 오류가 발생했습니다.", false, "error");
		
		try {
			int result = service.insertMember(member);
			
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
	public ResponseEntity<ResponseDTO> memberLogin(@RequestBody Member member){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중 오류가 발생했습니다.", null, "error");
		
		try {
			LoginMember loginMember = service.memberLogin(member);
			
			if(loginMember == null) {
				res = new ResponseDTO(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요", null, "warning");
			}else {				
				res = new ResponseDTO(HttpStatus.OK, "", loginMember, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 상세조회 
	@GetMapping("/{memberNo}")
	public ResponseEntity<ResponseDTO> selectMember(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 조회중, 오류가 발생하였습니다.", null, "error");
		try {
			System.out.println("memberNo : " + memberNo); // o
			Member member = service.selectMember(memberNo);
			System.out.println("member : " + member);
			res = new ResponseDTO(HttpStatus.OK, "", member, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 정보수정
	@PatchMapping
	public ResponseEntity<ResponseDTO> updateMember(@RequestBody UpdateMember updateMember){							
		Member updMember = updateMember.getMember(); //수정할 회원정보가 담긴 객체(회원번호, 이름, 생년월일, 전화번호, 이메일, 주소)
		List<String> delCtgList = updateMember.getDelCategory(); //기존 관심 카테고리에서 삭제해야할 리스트
		List<String> addCtgList = updateMember.getAddCategory(); //추가해야할 회원의 관심 카테고리 리스트
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 수정중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.updateMember(updMember, delCtgList, addCtgList);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "회원 수정 완료하였습니다.",true, "success");		//현재저장된 프로파일명 전
				
			}else {
				res = new ResponseDTO(HttpStatus.OK, "회원 수정중, 오류가 발생하였습니다", false, "warning"); 
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원관심카테고리 조회
	@GetMapping("/category/{memberNo}")
	public ResponseEntity<ResponseDTO> selectCategory(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			List<String> ctgList = service.selectCategory(memberNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", ctgList, "");
			
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 프로필 파일명(서버에 저장된) 조회
	@GetMapping("/profile/{memberNo}")
	public ResponseEntity<ResponseDTO> selectProfile(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.OK, "프로필 조회중, 오류가 발생하였습니다.", false, "error");
		
		try {
			String filePath = service.selectProfile(memberNo);
			
			res = new ResponseDTO(HttpStatus.OK, "", filePath, "");
			
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	//회원 프로필(이미지) 초기화
	@PatchMapping("/profile/{memberNo}")
	public ResponseEntity<ResponseDTO> deleteProfile(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "초기화 중 오류가 발생하였습니다.", false, "error");
		
		try {
			String prevFilePath = service.deleteProfile(memberNo);	//preFilePath : 서버에 저장된 기존파일명
			
			//기존 파일 삭제 처리
			if(prevFilePath != null) {
				String savePath = uploadPath + "/member/";
				File delFile = new File(savePath + prevFilePath.substring(0, 8) + File.separator + prevFilePath);
				
				if(delFile.exists()) {
					delFile.delete();
				}
				
				res = new ResponseDTO(HttpStatus.OK, "초기화 완료하였습니다.", true, "success");
				
			}else {
				res = new ResponseDTO(HttpStatus.OK, "초기화 중 오류가 발생하였습니다.", false, "warning");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 프로필(이미지) 수정
	@PostMapping("/profile")
	public ResponseEntity<ResponseDTO> updateProfile(
														int memberNo,							//회원번호
														String memberProfile, 					//기존 파일명										
														@ModelAttribute MultipartFile profile	//업로드할 파일 객체
													){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 변경 중 오류가 발생하였습니다.", false, "error");
		
		try {
			String filePath = fileUtil.uploadFile(profile, "/member/");	//서버에 저장후, 저장된 파일명 반환
			
			Member member = new Member();
			member.setMemberNo(memberNo);
			member.setMemberProfile(filePath);
			
			int result = service.updateProfile(member);	//member객체로 회원번호, 새롭게 저장된 파일명 세팅하여 전달
			
			if(result > 0) {
				if(memberProfile != null) {	//기존 저장되어 있는 프로필 이미지가 있다면
					String savePath = uploadPath + "/member/";
					File delFile = new File(savePath + memberProfile.substring(0, 8) + File.separator + memberProfile);
					
					if(delFile.exists()) {
						delFile.delete();	//파일 삭제
					}
				}
				
				//프론트에서 재랜더링 하기위해 filePath 전달
				res = new ResponseDTO(HttpStatus.OK, "수정 완료하였습니다.", filePath, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "수정 중, 오류가 발생하였습니다.", false, "warning");
			}
		
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//비밀번호 변경 - 기존 비밀번호 체크
	@PostMapping("/checkPw")
	public ResponseEntity<ResponseDTO> checkPw(@RequestBody Member member){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기존 비밀번호 확인중, 오류가 발생하였습니다.", false, "error");
		
		try {
			boolean chkResult = service.checkPw(member);
			
			res = new ResponseDTO(HttpStatus.OK, "", chkResult, "");

		}catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//비밀번호 변경 - 변경 처리
	@PatchMapping("/updatePw")
	public ResponseEntity<ResponseDTO> updateMemberPw(@RequestBody Member member){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 변경중, 오류가 발생하였습니다.", false, "error");
		
		try{
			int result = service.updateMemberPw(member);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "비밀번호가 정상적으로 변경되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "비밀번호변경중, 오류가 발생하였습니다.", false, "warning");
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 탈퇴 - 회원 탈퇴 여부(0 : 정상, 1 : 탈퇴) -> 회원의 기부 내역을 보존하고자
	@PatchMapping("/delete/{memberNo}")
	public ResponseEntity<ResponseDTO> deleteMember(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원탈퇴중, 오류가 발생하였습니다.",false, "error");
		
		try {
			 HashMap<String, Object> resultMap = service.deleteMember(memberNo);
			 int result = (Integer) resultMap.get("result");
		     String delFileName = (String) resultMap.get("delFileName");
			 
			 if(result > 0) {	//db 잘 처리되었다면,
				 if(delFileName != null) {	//서버에 저장된 파일 삭제
					 String savePath = uploadPath + "/member/";
					 File delFile = new File(savePath + delFileName.substring(0, 8) + File.separator + delFileName);
					
					if(delFile.exists()) {
						delFile.delete();
					}
				 }
				 res = new ResponseDTO(HttpStatus.OK, "회원 탈퇴 완료하였습니다.", true, "success" );
			 }else {
				 res = new ResponseDTO(HttpStatus.OK, "회원 탈퇴중 오류가 발생하였습니다.", false, "warning" );
			 }
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	

	// 회원별 알림 리스트 조회
	@GetMapping("/alarm/{memberNo}")
	public ResponseEntity<ResponseDTO> selectAlarmList(@PathVariable int memberNo) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "알림 조회 중, 오류가 발생하였습니다.", null, "error");

		try {
			ArrayList<MemberAlarm> alarmList = service.selectAlarmList(memberNo);
			System.out.println("최종 alarmList :" + alarmList);
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
				System.out.println(updateCount);
				res = new ResponseDTO(HttpStatus.OK, "", true, "");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "", false, "");
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}


	//회원 관심단체 조회
	@GetMapping("/orgLike/{reqPage}/{memberNo}")
	public ResponseEntity<ResponseDTO> selectOrgLikeList(@PathVariable int reqPage, @PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", false, "error");
		 
		try {
			//회원 관심단체 목록과 페이지 네비게이션 정보 조회
			HashMap<String, Object> paraMap = service.selectOrgLikeList(reqPage, memberNo);
			res= new ResponseDTO(HttpStatus.OK, "", paraMap , "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 관심단체 삭제
	@DeleteMapping("/delLikeOrg/{orgNo}/{memberNo}")
	public ResponseEntity<ResponseDTO> deleteOrgLikeList(@PathVariable int orgNo, @PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "취소중, 오류가 발생하였습니다.", false, "error");

		try {
			int result = service.delLikeOrg(orgNo, memberNo);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "", true, "");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "취소 중, 오류가 발생하였습니다.", false, "warning");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		
	}
	
	//회원 기부내역 조회
	@GetMapping("/donationHistory/{memberNo}")
	public ResponseEntity<ResponseDTO> selectDonationHistory (@PathVariable int memberNo,
															  @RequestParam int reqPage,
															  @RequestParam String startDate,
															  @RequestParam String endDate
																){
	
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회중, 오류가 발생하였습니다.", false, "error");
		try {
			HashMap<String, Object> paraMap = service.selectDonationHistory(memberNo, reqPage, startDate, endDate);
			
			res = new ResponseDTO(HttpStatus.OK, "", paraMap, "");
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 충전, 출금내역 조회
	@GetMapping("/walletHistory/{memberNo}")
	public ResponseEntity<ResponseDTO> selectWalletHistory (@PathVariable int memberNo,			
															@RequestParam String filter,
															@RequestParam int reqPage,
															@RequestParam String startDate,
															@RequestParam String endDate
															){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			HashMap<String, Object> walletMap = service.selectWalletHistory(memberNo, filter, reqPage, startDate, endDate);
			res = new ResponseDTO(HttpStatus.OK, "", walletMap, "");
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 충전하기
	@PostMapping("/charge/{memberNo}")
	public ResponseEntity<ResponseDTO> charge(@PathVariable int memberNo, @RequestParam int charge){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "결제 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.charge(memberNo, charge);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "결제 완료하였습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "결제 중, 오류가 발생하였습니다..", false, "warning");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	// 회원별 설문조사 내역 조회
	@GetMapping("/surveyHistory/{memberNo}")
	public ResponseEntity<ResponseDTO> selectSurveyHistory(@PathVariable int memberNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "설문조사 내역 조회 중 오류가 발생하였습니다.", false, "error");
		try {
			ArrayList<MemberSurveyAnswer> surveyList  = service.selectSurveyHistory(memberNo);
			res = new ResponseDTO(HttpStatus.OK, "", surveyList, "");
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 아이디 찾기
	@PostMapping("/searchId")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectMemberId(@RequestBody Member member) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			String memberId = service.selectMemberId(member);
			
			if(memberId != null) {
				int idLength = memberId.length();
				String first = memberId.substring(0,2);
				String last = memberId.substring(idLength-2);
				String marker = "*".repeat(idLength-4);
				memberId = first + marker + last;
				
				res = new ResponseDTO(HttpStatus.OK, "아이디 : " + memberId, true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "이름 또는 전화번호가 일치하지 않습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//회원 비밀번호 찾기
	@PostMapping("/searchPw")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> selectMemberPw(@RequestBody Member member) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 조회 중 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.selectMemberPw(member);
			
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

}
