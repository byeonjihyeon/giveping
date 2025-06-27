package kr.or.iei.news.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.news.model.dao.NewsDao;

@Service
public class NewsService {
	@Autowired
	private NewsDao dao;
}
