package kr.or.iei.news.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.news.model.service.NewsService;

@RestController
@CrossOrigin("*")
@RequestMapping("/news")
public class NewController {
	@Autowired
	private NewsService service;
	
}
