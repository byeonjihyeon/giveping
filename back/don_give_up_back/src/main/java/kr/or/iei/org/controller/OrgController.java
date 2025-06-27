package kr.or.iei.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.org.model.service.OrgService;

@RestController
@CrossOrigin("*")
@RequestMapping("/org")
public class OrgController {
	@Autowired
	private OrgService service;
}
