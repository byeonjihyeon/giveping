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
	int selectMemberCount(Map<String, Object> listMap);
	
	ArrayList<AdminMember> selectMemberList(Map<String, Object> listMap);

	//ArrayList<Member> selectMemberList(PageInfo pageInfo, String searchType, String keyword);

	int changeMemberLevel(AdminMember member);

	
	int selectOrgCount();

	ArrayList<AdminOrg> selectOrgList(PageInfo pageInfo);
	
	int updateOrgStatus(AdminOrg org);

	
	int selectBizCount();

	ArrayList<AdminBiz> selectBizList(PageInfo pageInfo);

	int updateBizStatus(AdminBiz biz);
	
	ArrayList<AdminRefund> selectRefundList(Map<String, Object> paramMap);
	
	int selectRefundCount(String showType);

	int updateRefundStatus(AdminRefund refund);


	ArrayList<AdminReport> selectReportList(PageInfo pageInfo);

	
	int selectReportCount();

	AdminBiz selectBizStatus(int bizNo);

	ArrayList<AdminOrg> selectDeleteList(Map<String, Object> paramMap);

	int selectDeleteCount(String showType);

	ArrayList<AdminPayout> selectPayoutList(Map<String, Object> paramMap);

	int updatePayoutStatus(AdminPayout adminPayout);

	int selectPayoutCount(String showType);

	List<AdminBiz> selectOneOrgBizList(int orgNo);

	AdminOrg selectOrgStatus(int orgNo);

	int updateDelStatus(AdminOrg org);

	
}
