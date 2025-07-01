package kr.or.iei.biz.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.or.iei.biz.model.dao.BizDao;
import kr.or.iei.biz.model.dto.Biz;
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
		// TODO Auto-generated method stub
		return dao.selectOneDonateBiz(bizNo);
	}

	public HashMap<String, Object> searchDonateBiz(Keyword keyword) {
		System.out.println(keyword.toString());
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectSearchCount(keyword);//전체 게시글 수
		System.out.println("totalcount : " + totalcount);
		
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
}
