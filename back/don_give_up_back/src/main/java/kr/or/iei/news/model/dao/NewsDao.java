package kr.or.iei.news.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.news.model.dto.Comment;
import kr.or.iei.news.model.dto.News;
import kr.or.iei.news.model.dto.NewsOrg;

@Mapper
public interface NewsDao {

	int selectNewsCount();

	ArrayList<News> selectNewsList(PageInfo pageInfo);

	News selectOneNews(int newsNo);

	int selectNewsNo();

	int insertNews(News news);

	ArrayList<NewsOrg> selectOneOrg(String orgName);

	int updateNews(News news);

	int deleteNews(int newsNo);

	ArrayList<Comment> selectCommentList(int newsNo);
	
	

}
