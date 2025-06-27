package kr.or.iei.admin.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dao.AdminDao;

@Service
public class AdminService {
	@Autowired 
	private AdminDao dao;
}
