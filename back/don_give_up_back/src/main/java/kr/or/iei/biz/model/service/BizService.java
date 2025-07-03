package kr.or.iei.biz.model.service;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.biz.model.dao.BizDao;
import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.Keyword;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;

@Service
public class BizService {
	@Autowired
	private BizDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectDonateBizList(int reqPage, List<String> categories) {
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectBoardCount(categories);//전체 게시글 수
		
		// 페이징 정보
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);

		HashMap<String, Object> param = new HashMap<>();
		param.put("start", pageInfo.getStart());
		param.put("end", pageInfo.getEnd());
		param.put("categories", categories);
		
		// 게시글 목록 조회
		ArrayList<Biz> donateBizList = dao.selectDonateBizList(param);
		
		HashMap<String, Object> donateBizMap = new HashMap<String, Object>();
		donateBizMap.put("donateBizList", donateBizList);
		donateBizMap.put("pageInfo", pageInfo);
		
		return donateBizMap;
	}

	public Biz selectOneDonateBiz(int bizNo) {
		
		// 1. 상세 조회 시, 해당 사업에 기부한 회원 조회
		List<BizMember> bizMemberList = dao.selectDonateMember(bizNo);
		// 2. 기부 사업 상세 조회
	    Biz biz = dao.selectOneDonateBiz(bizNo);
	    
	    // 3. 1번에서 조회된 회원 리스트를 Biz 객체에 set
	    biz.setBizMemberList(bizMemberList);
		
		return biz;
	}

	public HashMap<String, Object> searchDonateBiz(Keyword keyword) {
		System.out.println(keyword.toString());
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectSearchCount(keyword);//전체 게시글 수
		
		// 페이징 정보 (reqPage 임시로 1로 지정)
		PageInfo pageInfo = pageUtil.getPageInfo(1, viewCnt, pageNaviSize, totalcount);
		
		keyword.setPageInfo(pageInfo);
		
		// 게시글 목록 조회
		ArrayList<Biz> donateBizList = dao.selectSearchBizList(keyword);
		
		HashMap<String, Object> donateBizMap = new HashMap<String, Object>();
		donateBizMap.put("donateBizList", donateBizList);
		donateBizMap.put("pageInfo", pageInfo);
		
		return donateBizMap;
	}

	public BizMember selectMemberMoney(int memberNo) {
		return dao.selectMemberMoney(memberNo);
	}

	@Transactional
	public int bizDonate(BizDonationList bizDonationList) {
		return dao.bizDonate(bizDonationList);
	}
}
