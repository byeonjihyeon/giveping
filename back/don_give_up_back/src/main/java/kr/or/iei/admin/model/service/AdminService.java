package kr.or.iei.admin.model.service;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.AdminPayout;
import kr.or.iei.admin.model.dto.AdminBiz;
import kr.or.iei.admin.model.dto.AdminMember;
import kr.or.iei.admin.model.dto.AdminOrg;
import kr.or.iei.admin.model.dto.AdminRefund;
import kr.or.iei.admin.model.dto.AdminReport;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.MailUtil;
import kr.or.iei.common.util.PageUtil;


@Service
public class AdminService {

	 @Autowired
   private AdminDao dao;
	 
	@Autowired
  private PageUtil pageUtil;
	
	@Autowired
  private MailUtil mailUtil;

	// 회원리스트 조회
	public HashMap<String, Object> selectMemberList(int reqPage, String searchType, String keyword) {
	    int viewCnt = 10;          // 한 페이지당 보여줄 행 갯수 
	    int pageNaviSize = 5;      // 페이지 네비게이션 길이

	    // 검색 조건 맵 생성
	    Map<String, Object> listMap = new HashMap<>();
	    listMap.put("searchType", searchType);
	    listMap.put("keyword", keyword);

	    // 총 회원 수 조회
	    int totalCount = dao.selectMemberCount(listMap);

	    // 페이지 정보 생성
	    PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);

	    // 페이지 정보 기반 범위 설정
	    listMap.put("start", pageInfo.getStart());
	    listMap.put("end", pageInfo.getEnd());

	    // 실제 회원 리스트 조회
	    ArrayList<AdminMember> memberList = dao.selectMemberList(listMap);
	    System.out.println("멤버 리스트 크기: " + memberList.size());

	    // 결과 맵 생성
	    HashMap<String, Object> memberMap = new HashMap<>();
	    memberMap.put("memberList", memberList);
	    memberMap.put("pageInfo", pageInfo);
	    memberMap.put("searchType", searchType);
	    memberMap.put("keyword", keyword);

	    return memberMap;
 }
	
	// 회원 등급 변경
	@Transactional
	public int changeMemberLevel(AdminMember member) {
		
		  return dao.changeMemberLevel(member);
   }

	
	// 단체 회원리스트 조회
	public HashMap<String, Object> selectOrgList(int reqPage, String searchType, String keyword) {
	      int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
	      int pageNaviSize = 5;    //페이지 네비게이션 길이
	      
	       // 검색 조건 맵 생성
	       Map<String, Object> listMap = new HashMap<>();
	       listMap.put("searchType", searchType);
	       listMap.put("keyword", keyword);
	       
	      int totalCount =dao.selectOrgCount(listMap);
	      
	      PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
	      
	       // 페이지 정보 기반 범위 설정
	       listMap.put("start", pageInfo.getStart());
	       listMap.put("end", pageInfo.getEnd());
	      
	       ArrayList<AdminOrg> orgList =dao.selectOrgList(listMap);
	      
	      HashMap<String,Object>orgMap =new HashMap<String,Object>();
	      orgMap.put("orgList", orgList);
	      orgMap.put("pageInfo", pageInfo);
	      orgMap.put("searchType", searchType);
	      orgMap.put("keyword", keyword);
	      
	      return orgMap;
	      
	   }
	
	//단체회원 상태 변경
	@Transactional
	public int updateOrgStatus(AdminOrg org) {
		
	    return dao.updateOrgStatus(org);
	}
	
	//기부 사업리스트 조회
	public HashMap<String, Object> selectBizList(int reqPage, String status, String searchType, String keyword) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		
	     // 검색 조건 맵 생성
	       Map<String, Object> listMap = new HashMap<>();
	       listMap.put("status", status);
	       listMap.put("searchType", searchType);
	       listMap.put("keyword", keyword);
	   	System.out.println("service-searchType: "+ searchType);
	   	System.out.println("status:"+status);
	       
		int totalCount =dao.selectBizCount(listMap);
		

		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		 listMap.put("start", pageInfo.getStart());
	     listMap.put("end", pageInfo.getEnd());
		
		
		ArrayList<AdminBiz> bizList =dao.selectBizList(listMap);
		
		HashMap<String,Object>bizMap =new HashMap<String,Object>();
	    bizMap.put("bizList", bizList);
		bizMap.put("pageInfo", pageInfo);
	    bizMap.put("status", status);
	    bizMap.put("searchType", searchType);
	    bizMap.put("keyword", keyword);
	
	 return bizMap;
	
	}

	//기부사업 상태변경
	@Transactional
	public int updateBizStatus(AdminBiz biz) {
        		
		   AdminBiz bizStatus = dao.selectBizStatus(biz.getBizNo());
		   System.out.println("selectBizStatus 결과: " + bizStatus);  // null이면 문제 확정

		   int currentStatus=  bizStatus.getBizStatus();
               System.out.println("현재상태 :" + currentStatus );
                       
		    int result = dao.updateBizStatus(biz);
		    
		    System.out.println("bizStatus:"+ biz.getBizStatus());
		    
		    
		    if (result > 0 && currentStatus == 0 && biz.getBizStatus() == 1) {
		    	System.out.println("result:" + result);
		    	  String to = bizStatus.getOrgEmail();
		          String bizName = bizStatus.getBizName();
		          String orgName = bizStatus.getOrgName();

		        System.out.println(to);
		        System.out.println(bizName);
		        System.out.println(orgName);
		        
		        mailUtil.sendApproveMail(to, bizName, orgName);
		    }

		return result;

	    }
	
    //환불신청/내역 리스트 조회
	public HashMap<String, Object> selectRefundList(int reqPage, String showType) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectRefundCount(showType);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		  Map<String, Object> paramMap = new HashMap<>();
		    paramMap.put("start", pageInfo.getStart());
		    paramMap.put("end", pageInfo.getEnd());
		    paramMap.put("showType", showType);
		
		ArrayList<AdminRefund> refundList =dao.selectRefundList(paramMap);
		
		HashMap<String,Object> refundMap =new HashMap<String,Object>();
		    refundMap.put("refundList", refundList);   
		    refundMap.put("pageInfo", pageInfo);
		    refundMap.put("showType", showType);
		    refundMap.put("start", pageInfo.getStart());
		    refundMap.put("end", pageInfo.getEnd());
		    
	  return refundMap;
	
	}
	
	//환불 상태 변경
	@Transactional
	public int updateRefundStatus(AdminRefund refund) {
		
		return dao.updateRefundStatus(refund);
	}
	
	//신고 내역 조회
	/*
	public HashMap<String, Object> selectReportList(int reqPage) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectReportCount(type);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		ArrayList<AdminReport> reportList =dao.selectReportList(pageInfo);
		
		HashMap<String,Object> reportMap =new HashMap<String,Object>();
	    reportMap.put("reportList", reportList);   
	 
	    reportMap.put("pageInfo", pageInfo);
	    
	return reportMap;
	
	}
*/
	//탈퇴 신청 관리 (단체)
	public HashMap<String, Object> selectDeleteList(int reqPage, String showType) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectDeleteCount(showType);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		Map<String, Object> paramMap = new HashMap<>();
		    paramMap.put("start", pageInfo.getStart());
		    paramMap.put("end", pageInfo.getEnd());
		    paramMap.put("showType", showType);
		  
		ArrayList<AdminOrg> deleteList =dao.selectDeleteList(paramMap);

		
		for (AdminOrg org : deleteList) {
			List<AdminBiz> bizList = dao.selectOneOrgBizList(org.getOrgNo());
			org.setBizList(bizList);  
			
		} 
		
		HashMap<String,Object> deleteMap =new HashMap<String,Object>();
		    deleteMap.put("deleteList", deleteList);   
		    deleteMap.put("pageInfo", pageInfo);
		    deleteMap.put("showType", showType);
		    deleteMap.put("start", pageInfo.getStart());
		    deleteMap.put("end", pageInfo.getEnd());
	    
		return deleteMap;
	}
	
	//탈퇴상태 변경
	@Transactional
	public int updateDelStatus(AdminOrg org) {
	        		
		 AdminOrg orgStatus = dao.selectOrgStatus(org.getOrgNo());

		 int currentStatus = orgStatus.getOrgStatus();
	              
	     int result = dao.updateDelStatus(org);
			    
	     if (result > 0 && currentStatus == 3 && org.getOrgStatus() == 4) {
		
	     String to = orgStatus.getOrgEmail();
	     String orgName = orgStatus.getOrgName();
			          
	     mailUtil.sendDelOrgMail(to, orgName);
			   }

	    return result;

		   }


	//관리자 송금 내역 조회
	public HashMap<String, Object> selectPayoutList(int reqPage, String showType) {
		int viewCnt = 10;        //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectPayoutCount(showType);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		  Map<String, Object> paramMap = new HashMap<>();
		    paramMap.put("start", pageInfo.getStart());
		    paramMap.put("end", pageInfo.getEnd());
		    paramMap.put("showType", showType);
		
		ArrayList<AdminPayout> payoutList =dao.selectPayoutList(paramMap);
		
		HashMap<String,Object> payoutMap =new HashMap<String,Object>();
			payoutMap.put("payoutList", payoutList);   
			payoutMap.put("pageInfo", pageInfo);
			payoutMap.put("showType", showType);
		    payoutMap.put("start", pageInfo.getStart());
		    payoutMap.put("end", pageInfo.getEnd());
		    
		return payoutMap;
	}
 
   // 관리자 송금 상태 변경
	public int updatePayoutStatus(AdminPayout adminPayout) {
		
		return dao.updatePayoutStatus(adminPayout);
	}

	// 댓글 신고내역 조회
	public HashMap<String, Object> selectCommentReportList(int reqPage, String tab, String startDate, String endDate) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectCommentReportCount(tab,startDate,endDate);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("tab", tab); //comment
	    paramMap.put("startDate", startDate); // null
	    paramMap.put("endDate", endDate);// null
	    paramMap.put("start", pageInfo.getStart());  // 1
	    paramMap.put("end", pageInfo.getEnd());   //end : 10
	   
		
		ArrayList<AdminReport> reportList =dao.selectCommentReportList(paramMap);
		
		
		HashMap<String,Object> reportCoMap =new HashMap<String,Object>();
	    reportCoMap.put("reportList", reportList);   
	    reportCoMap.put("pageInfo", pageInfo);
	    reportCoMap.put("startDate", startDate);
	    reportCoMap.put("endDate", endDate);
	
	return reportCoMap;
		
	}
    //단체 신고내역 조회
	public HashMap<String, Object> selectOrgReportList(int reqPage,String tab, String startDate, String endDate) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectOrgReportCount(tab,startDate, endDate);
		System.out.println("totcnt:"+totalCount);
		System.out.println("startDate : " + startDate);
		System.out.println("endDate : " + endDate);
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("tab", tab);
	    paramMap.put("startDate", startDate);
	    paramMap.put("endDate", endDate);
	    paramMap.put("start", pageInfo.getStart()); 
	    paramMap.put("end", pageInfo.getEnd());   
		
		ArrayList<AdminReport> reportList =dao.selectOrgReportList(paramMap);
		System.out.println("신고 리스트:" +reportList );
		System.out.println("paramMap:" + paramMap);
		
		HashMap<String,Object> reportOrgMap =new HashMap<String,Object>();
	    reportOrgMap.put("reportList", reportList);   
	    reportOrgMap.put("pageInfo", pageInfo);
	    reportOrgMap.put("startDate", startDate);
	    reportOrgMap.put("endDate", endDate);
	
	return reportOrgMap;
		
	}
	
	}

	
	/*
	public HashMap<String, Object> selectBoardList(int reqPage) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectBoardCount();
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		ArrayList<Board> boardList =dao.selectBoardList(pageInfo);
		
		HashMap<String,Object>boardMap =new HashMap<String,Object>();
		boardMap.put("boardList", boardList);
		boardMap.put("pageInfo", pageInfo);
			
		return boardMap;
	   }
	
	@Transactional
	public int changeBoardStatus(Board board) {
	     
		return dao.changeBoardStatus(board);
	}
*/
	

