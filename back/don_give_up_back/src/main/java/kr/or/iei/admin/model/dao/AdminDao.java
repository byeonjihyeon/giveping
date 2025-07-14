package kr.or.iei.admin.model.dao;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSession;

import kr.or.iei.admin.model.dto.AdminPayout;
import kr.or.iei.admin.model.dto.AdminBiz;
import kr.or.iei.admin.model.dto.AdminMember;
import kr.or.iei.admin.model.dto.AdminOrg;
import kr.or.iei.admin.model.dto.AdminRefund;
import kr.or.iei.admin.model.dto.AdminReport;
import kr.or.iei.common.model.dto.PageInfo;


@Mapper
public interface AdminDao {
/*
	int selectBoardCount();

	ArrayList<Board> selectBoardList(PageInfo pageInfo);

	int changeBoardStatus(Board board);
*/
	
	//회원관리 메소드
	int selectMemberCount(Map<String, Object> listMap);
	
	ArrayList<AdminMember> selectMemberList(Map<String, Object> listMap);

	int changeMemberLevel(AdminMember member);

	
	//단체 관리 메소드
	int selectOrgCount();

	ArrayList<AdminOrg> selectOrgList(PageInfo pageInfo);
	
	int updateOrgStatus(AdminOrg org);

	
	//기부사업 관리 메소드
	int selectBizCount();

	ArrayList<AdminBiz> selectBizList(PageInfo pageInfo);

	int updateBizStatus(AdminBiz biz);
	
	
	//환불관리 메소드
	int selectRefundCount(String showType);
	
	ArrayList<AdminRefund> selectRefundList(Map<String, Object> paramMap);
	
	int updateRefundStatus(AdminRefund refund);

	
    //신고내역 관리 메소드
	int selectReportCount();
	
	ArrayList<AdminReport> selectReportList(PageInfo pageInfo);

	AdminBiz selectBizStatus(int bizNo);

	
	//탈퇴단체 메소드
	ArrayList<AdminOrg> selectDeleteList(Map<String, Object> paramMap);

	int selectDeleteCount(String showType);
		
	List<AdminBiz> selectOneOrgBizList(int orgNo);
	
	int updateDelStatus(AdminOrg org);

	AdminOrg selectOrgStatus(int orgNo);

	
	//송금내역 관리 메소드
	int selectPayoutCount(String showType);
	
	ArrayList<AdminPayout> selectPayoutList(Map<String, Object> paramMap);

	int updatePayoutStatus(AdminPayout adminPayout);

	

	
}
