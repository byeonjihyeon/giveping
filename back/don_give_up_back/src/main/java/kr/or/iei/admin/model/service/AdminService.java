package kr.or.iei.admin.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.org.model.dto.Org;

@Service
public class AdminService {
	
	@Autowired 
	private AdminDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectMemberList(int reqPage) {
		
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectMemberCount();
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		ArrayList<Member> memberList =dao.selectMemberList(pageInfo);
		
		HashMap<String,Object>memberMap =new HashMap<String,Object>();
	    memberMap.put("memberList", memberList);
		memberMap.put("pageInfo", pageInfo);
		
		return memberMap;
	}

	public HashMap<String, Object> selectOrgList(int reqPage) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectOrgCount();
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		ArrayList<Org> orgList =dao.selectOrgList(pageInfo);
		
		HashMap<String,Object>orgMap =new HashMap<String,Object>();
	    orgMap.put("orgList", orgList);
		orgMap.put("pageInfo", pageInfo);
		
		return orgMap;
		
	}
}
