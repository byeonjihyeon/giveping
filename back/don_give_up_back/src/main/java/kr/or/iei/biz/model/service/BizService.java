package kr.or.iei.biz.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.or.iei.biz.model.dao.BizDao;

@Service
public class BizService {
	@Autowired
	private BizDao dao;
}
