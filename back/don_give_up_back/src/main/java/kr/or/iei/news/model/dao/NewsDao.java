package kr.or.iei.news.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.news.model.dto.News;

@Mapper
public interface NewsDao {

	int selectNewsCount();

	ArrayList<News> selectNewsList(PageInfo pageInfo);
	
	

}
