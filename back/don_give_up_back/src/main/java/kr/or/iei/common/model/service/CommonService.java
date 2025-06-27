package kr.or.iei.common.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dao.CommonDao;
import kr.or.iei.common.model.dto.DonateCode;

@Service
public class CommonService {

	@Autowired
	private CommonDao dao;

	//기부 카테고리 조회
	public ArrayList<DonateCode> selectDonateCtg() {
		return dao.selectDonateCtg();
	}
}
