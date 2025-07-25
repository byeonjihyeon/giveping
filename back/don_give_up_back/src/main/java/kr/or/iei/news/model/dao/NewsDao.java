package kr.or.iei.news.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;


import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.news.model.dto.Comment;
import kr.or.iei.news.model.dto.News;
import kr.or.iei.news.model.dto.NewsOrg;
import kr.or.iei.news.model.dto.NewsReport;

@Mapper
public interface NewsDao {

	int selectNewsCount();

	ArrayList<News> selectNewsList(HashMap<String, Object> param);

	News selectOneNews(int newsNo);

	int selectNewsNo();

	int insertNews(News news);

	ArrayList<NewsOrg> selectOneOrg(String orgName);

	int updateNews(News news);

	//소식 글 '삭제' 상태로 업데이트
	int deleteNews(int newsNo);

	int deleteComment(int commentNo);

	int updateComment(Comment comment);

	int updateReadCount(int newsNo);

	ArrayList<NewsReport> selectReportCode();

	int regCommentReport(NewsReport newsReport);

	int regComment(Comment comment);
	
	

}
