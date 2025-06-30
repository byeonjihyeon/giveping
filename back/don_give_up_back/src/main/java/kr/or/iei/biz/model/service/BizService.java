package kr.or.iei.biz.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.or.iei.biz.model.dao.BizDao;
import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;

@Service
public class BizService {
	@Autowired
	private BizDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectDonateBizList(int reqPage) {
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectBoardCount();//전체 게시글 수
		
		// 페이징 정보
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);
		
		// 게시글 목록 조회
		ArrayList<Biz> donateBizList = dao.selectDonateBizList(pageInfo);
		
		HashMap<String, Object> donateBizMap = new HashMap<String, Object>();
		donateBizMap.put("donateBizList", donateBizList);
		donateBizMap.put("pageInfo", pageInfo);
		
		return donateBizMap;
	}
}
