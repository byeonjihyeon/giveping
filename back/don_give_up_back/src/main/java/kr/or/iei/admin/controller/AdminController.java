package kr.or.iei.admin.controller;


import java.util.HashMap;
import kr.or.iei.org.controller.OrgController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.AdminPayout;
import kr.or.iei.admin.model.dto.AdminBiz;
import kr.or.iei.admin.model.dto.AdminMember;
import kr.or.iei.admin.model.dto.AdminOrg;
import kr.or.iei.admin.model.dto.AdminRefund;
import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.member.model.dto.Member;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {

    private final FileUtil fileUtil;

    private final JwtUtils jwtUtils;

    private final OrgController orgController;

	@Autowired
	private AdminService service;
	
	@Autowired
	private JavaMailSender javaMailSender;

    AdminController(OrgController orgController, JwtUtils jwtUtils, FileUtil fileUtil) {
        this.orgController = orgController;
        this.jwtUtils = jwtUtils;
        this.fileUtil = fileUtil;
    }

	// 전체 회원 리스트 조회
	@GetMapping("/memberManage/{reqPage}")
	public ResponseEntity<ResponseDTO> selectMemberList(@PathVariable int reqPage,
			                                            @RequestParam (required = false)String searchType, 
                                                        @RequestParam (required = false)String keyword) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 목록 조회 중,오류가 발생하였습니다", null, "error");

		try {
			HashMap<String, Object> memberMap = service.selectMemberList(reqPage, searchType, keyword);
			res = new ResponseDTO(HttpStatus.OK, "", memberMap, "");
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

	}
	
	
	// 회원 등급 변경
	 @PatchMapping("/memberManage")
	  public ResponseEntity<ResponseDTO> changeMemberStatus(@RequestBody AdminMember member){
		 
	  ResponseDTO res= new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원등급 상태 변경 중 오류가 생겼습니다",false, "error");
	  
	  try { 
		  int result = service.changeMemberLevel(member); 
		  if(result>0) {
		  res= new ResponseDTO(HttpStatus.OK, "변경이 완료되었습니다.", true,"success"); 
		  } 
		} catch(Exception e){
	      e.printStackTrace();
	  
	  } return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus()); }
	 
	

	// 단체 리스트 조회
   @GetMapping("/orgManage/{reqPage}")
   public ResponseEntity<ResponseDTO> selectOrgList(@PathVariable int reqPage,
                                                    @RequestParam (required = false)String searchType, 
                                                    @RequestParam (required = false)String keyword) {
      ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중,오류가 발생하였습니다", null, "error");

      try {
         HashMap<String, Object> orgMap = service.selectOrgList(reqPage, searchType, keyword);
         res = new ResponseDTO(HttpStatus.OK, "", orgMap, "");
      } catch (Exception e) {
         e.printStackTrace();

      }
      return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

   }
	// 단체 상태 변경
	@PatchMapping("/orgManage")
	public ResponseEntity<ResponseDTO> updateOrgStatus(@RequestBody AdminOrg org) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "변경 중 오류가 생겼습니다", false, "error");

		try {
			int result = service.updateOrgStatus(org);
			if (result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "변경이 완료되었습니다.", true, "success");
			}
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 기부사업리스트조회
	@GetMapping("/bizManage/{reqPage}")
	public ResponseEntity<ResponseDTO> selectBizList(@PathVariable int reqPage,
		                                             @RequestParam (required = false) String status,
			                                         @RequestParam (required = false) String searchType, 
                                                     @RequestParam (required = false) String keyword) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중,오류가 발생하였습니다", null, "error");
	

		try {
			if(status.equals("5")) {
				status = null;
			}
			HashMap<String, Object> bizMap = service.selectBizList(reqPage, status, searchType, keyword);
			res = new ResponseDTO(HttpStatus.OK, "", bizMap, "");
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

	}

	// 기부사업 상태 변경
	@PatchMapping("/bizManage")
	public ResponseEntity<ResponseDTO> updateBizStatus(@RequestBody AdminBiz biz) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 변경 중 오류가 생겼습니다", false, "error");
	
		try {
	
			int result = service.updateBizStatus(biz);
			
			if (result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "변경이 완료되었습니다.", true, "success");
			}
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}

	// 환불신청/내역 리스트 조회
	@GetMapping("/refundManage/{reqPage}/{showType}")
	public ResponseEntity<ResponseDTO> selectRefundList(@PathVariable int reqPage, @PathVariable String showType ) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중,오류가 발생하였습니다", null, "error");

		try {
			HashMap<String, Object> refundMap = service.selectRefundList(reqPage, showType);
			res = new ResponseDTO(HttpStatus.OK, "", refundMap, "");
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

	}

	// 환불 상태 변경
	@PatchMapping("/refundManage")
	public ResponseEntity<ResponseDTO> updateRefundStatus(@RequestBody AdminRefund refund) {
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 변경 중 오류가 생겼습니다", false, "error");

		try {
			int result = service.updateRefundStatus(refund);
			if (result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "환불이 완료되었습니다.", true, "success");
			}
		} catch (Exception e) {
			e.printStackTrace();

		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
     }
	
	  // 신고내역 리스트 조회
		@GetMapping("/reportManage/{reqPage}/{tab}")
		public ResponseEntity<ResponseDTO> selectReportList(@PathVariable int reqPage, @PathVariable String tab,
				                                                                       @RequestParam(required = false, defaultValue = "") String startDate, 
				                                                                       @RequestParam(required = false, defaultValue = "") String endDate) {
			
			 try {
			HashMap<String, Object> reportMap=null;

				if("comment".equals(tab)){
					
					reportMap= service.selectCommentReportList(reqPage, tab, startDate, endDate);
					
				}else if("org".equals(tab)){
					reportMap= service.selectOrgReportList(reqPage, tab, startDate, endDate);
				}else {
					
					  return new ResponseEntity<>(
			                    new ResponseDTO(HttpStatus.BAD_REQUEST, "잘못된 신고 유형입니다", null, "error"),
			                    HttpStatus.BAD_REQUEST);
			        }

				
				ResponseDTO res = new ResponseDTO(HttpStatus.OK, "", reportMap, "");
			        return new ResponseEntity<>(res, HttpStatus.OK);

			    } catch (Exception e) {
			     
			    ResponseDTO res =new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "신고 목록 조회 중 오류 발생", null, "error");
			        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			    }
			}

		


		// 탈퇴 요청 리스트 조회
		@GetMapping("/deleteManage/{reqPage}/{showType}")
		public ResponseEntity<ResponseDTO> selectDeleteList(@PathVariable int reqPage, @PathVariable String showType) {
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "탈퇴 요청 목록 조회 중,오류가 발생하였습니다", null, "error");

			try {
				HashMap<String, Object> deleteMap = service.selectDeleteList(reqPage,showType);
				
				res = new ResponseDTO(HttpStatus.OK, "", deleteMap, "");
			} catch (Exception e) {
				e.printStackTrace();

			}
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
	// 탈퇴요청 상태 변경
		@PatchMapping("/deleteManage")
		public ResponseEntity<ResponseDTO> updateDelStatus(@RequestBody AdminOrg org) {
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 변경 중 오류가 생겼습니다", false, "error");

			try {
				int result = service.updateDelStatus(org);
				if (result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "탈퇴처리가 완료되어 메일을 발송합니다.", true, "success");
				}
			} catch (Exception e) {
				e.printStackTrace();

			}
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	     }
		
	  //관리자 모금액 송금내역 관리
		@GetMapping("/payoutManage/{reqPage}/{showType}")
	    public ResponseEntity<ResponseDTO> selectPayoutList(@PathVariable int reqPage, @PathVariable String showType ) {
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중,오류가 발생하였습니다", null, "error");

			try {
				HashMap<String, Object> payoutMap = service.selectPayoutList(reqPage, showType);
				res = new ResponseDTO(HttpStatus.OK, "", payoutMap, "");
			} catch (Exception e) {
				e.printStackTrace();

			}
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());

		}

		// 관리자 모금액 송금 상태 변경
		@PatchMapping("/payoutManage")
		public ResponseEntity<ResponseDTO> updatePayoutStatus(@RequestBody AdminPayout adminPayout) {
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, " 변경 중 오류가 생겼습니다", false, "error");

			try {
				int result = service.updatePayoutStatus(adminPayout);
				if (result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "송금이 완료되었습니다.", true, "success");
				}
			} catch (Exception e) {
				e.printStackTrace();

			}
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	     }
		

}

