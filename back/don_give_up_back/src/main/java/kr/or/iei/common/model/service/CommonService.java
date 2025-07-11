package kr.or.iei.common.model.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dao.CommonDao;
import kr.or.iei.common.model.dto.CommonBiz;
import kr.or.iei.common.model.dto.CommonOrg;
import kr.or.iei.common.model.dto.DonateCode;

@Service
public class CommonService {

	@Autowired
	private CommonDao dao;

	//기부 카테고리 조회
	public ArrayList<DonateCode> selectDonateCtg() {
		return dao.selectDonateCtg();
	}

	public int countAlarm(Map<String, Object> param) {
		return dao.countAlarm(param);
	}

	public ArrayList<CommonBiz> selectMainBizList(int memberNo) {
		// TODO Auto-generated method stub
		return dao.selectMainBizList(memberNo);
	}

	public ArrayList<CommonOrg> selectMainOrgList(int primaryNo) {
		return dao.selectMainOrgList(primaryNo);
	}
}
