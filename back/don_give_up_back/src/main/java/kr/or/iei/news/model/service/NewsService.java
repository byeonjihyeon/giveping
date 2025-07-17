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
import kr.or.iei.news.model.dto.Comment;
import kr.or.iei.news.model.dto.News;
import kr.or.iei.news.model.dto.NewsOrg;
import kr.or.iei.news.model.dto.NewsReport;

@Service
public class NewsService {
	@Autowired
	private NewsDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectNewsList(int reqPage) {
		int viewCnt = 10;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectNewsCount();//전체 게시글 수
		
		// 페이징 정보
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);
		
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("start", pageInfo.getStart());
		param.put("end", pageInfo.getEnd());
		
		// 게시글 목록 조회
		ArrayList<News> newsList = dao.selectNewsList(param);
		
		HashMap<String, Object> newsMap = new HashMap<String, Object>();
		newsMap.put("newsList", newsList);
		newsMap.put("pageInfo", pageInfo);
		return newsMap;
	}

	// 소식글 상세 조회
	public News selectOneNews(int newsNo) {
		// 조회수 증가 로직
		int result = dao.updateReadCount(newsNo);

		if (result > 0) {
			// 조회수 증가 성공했을 경우만 상세 조회
			return dao.selectOneNews(newsNo);
		} else {
			return null;
		}
	}

	@Transactional
	public int insertNews(News news) {
		// (1) 게시글 번호 조회
		int newsNo = dao.selectNewsNo();
		
		news.setNewsNo(newsNo);
		
		//(2) 게시글 정보 등록
		int result = dao.insertNews(news);
		return result;
	}

	public ArrayList<NewsOrg> selectOneOrg(String orgName) {
		
		return dao.selectOneOrg(orgName);
	}

	@Transactional
	public int updateNews(News news) {
		// TODO Auto-generated method stub
		return dao.updateNews(news);
	}

	//소식 글 '삭제' 상태로 업데이트
	@Transactional
	public News deleteNews(int newsNo) {
		News news = dao.selectOneNews(newsNo);
		
		if(news != null) {
			int result = dao.deleteNews(newsNo);
			
			if(result > 0) {
				return news;
			}else {
				return null;
			}
		}
		return null;	
	}

	/*
	public ArrayList<Comment> selectCommentList(int newsNo) {
		return dao.selectCommentList(newsNo);
	}
	*/

	@Transactional
	public int deleteComment(int commentNo) {
		return dao.deleteComment(commentNo);
	}

	@Transactional
	public int updateComment(Comment comment) {
		return dao.updateComment(comment);
	}

	public ArrayList<NewsReport> selectReportCode() {
		return dao.selectReportCode();
	}

	@Transactional
	public int regCommentReport(NewsReport newsReport) {
		return dao.regCommentReport(newsReport);
	}

	@Transactional
	public int regComment(Comment comment) {
		return dao.regComment(comment);
	}
}
