package kr.or.iei.common.model.dao;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.CommonBiz;
import kr.or.iei.common.model.dto.CommonOrg;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.news.model.dto.News;

@Mapper
public interface CommonDao {

	ArrayList<DonateCode> selectDonateCtg(); //기부 카테고리 조회

	// 헤더 - 알람 갯수 조회
	int countAlarm(Map<String, Object> param);

	// 메인 페이지 - 기부 사업 조회
	ArrayList<CommonBiz> selectMainBizList(int memberNo);

	// 메인 페이지 - 기부 단체 조회
	ArrayList<CommonOrg> selectMainOrgList(int memberNo);
	
	// 메인 페이지 - 총 기부금 조회
	String selectDonationAmount();
	
	// 메인 페이지 - 최신 소식 조회
	ArrayList<News> selectMainNews();

}
