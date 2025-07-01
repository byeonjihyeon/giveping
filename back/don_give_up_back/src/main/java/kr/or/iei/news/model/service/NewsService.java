package kr.or.iei.news.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.news.model.dao.NewsDao;
import kr.or.iei.news.model.dto.News;
import kr.or.iei.news.model.dto.NewsOrg;

@Service
public class NewsService {
	@Autowired
	private NewsDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectNewsList(int reqPage) {
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectNewsCount();//전체 게시글 수
		
		// 페이징 정보
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);
		
		// 게시글 목록 조회
		ArrayList<News> newsList = dao.selectNewsList(pageInfo);
		
		HashMap<String, Object> newsMap = new HashMap<String, Object>();
		newsMap.put("newsList", newsList);
		newsMap.put("pageInfo", pageInfo);
		
		return newsMap;
	}

	public News selectOneNews(int newsNo) {
		// TODO Auto-generated method stub
		return dao.selectOneNews(newsNo);
	}

	@Transactional
	public int insertNews(News news) {
		// (1) 게시글 번호 조회
		int newsNo = dao.selectNewsNo();
		System.out.println("newsNo : " + newsNo);
		
		news.setNewsNo(newsNo);
		
		//(2) 게시글 정보 등록
		int result = dao.insertNews(news);
		
		
		
		//return result;
		return 0;
	}

	public ArrayList<NewsOrg> selectOneOrg(String orgName) {
		
		return dao.selectOneOrg(orgName);
	}
}
