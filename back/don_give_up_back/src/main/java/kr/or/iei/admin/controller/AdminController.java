package kr.or.iei.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.service.AdminService;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private AdminService service;
	
}
