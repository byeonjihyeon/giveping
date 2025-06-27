package kr.or.iei.org.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.org.model.dao.OrgDao;

@Service
public class OrgService {
	@Autowired
	private OrgDao dao;
}
