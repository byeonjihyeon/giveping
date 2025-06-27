package kr.or.iei.biz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.biz.model.service.BizService;

@RestController
@CrossOrigin("*")
@RequestMapping("/biz")
public class BizController {
	@Autowired
	private BizService service;
}
