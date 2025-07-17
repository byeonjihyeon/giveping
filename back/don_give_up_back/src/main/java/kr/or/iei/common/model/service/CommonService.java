package kr.or.iei.common.model.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dao.CommonDao;
import kr.or.iei.common.model.dto.CommonBiz;
import kr.or.iei.common.model.dto.CommonOrg;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.news.model.dto.News;

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
	
	//총 기부금 조회
	public String selectDonationAmount() {
		return dao.selectDonationAmount();
	}
	
	//메인 페이지에 들어갈 최신 소식 조회
	public ArrayList<News> selectMainNews() {
		
		ArrayList<News> newsList = dao.selectMainNews();
		
		//클라이언트에 전달할 메인 소식 리스트 (길이에 따라 2개, 또는 4개)
		ArrayList<News> mainNewsList = new ArrayList<>();
		
		//전체 소식 갯수가 4개 이상이라면, 최신순으로 4개만등록
		if(newsList.size() >= 4) {
			for(int i=0; i<4; i++) {
				News news = newsList.get(i);
				mainNewsList.add(news);
			}
		}else if(newsList.size() >= 1 && newsList.size() < 4) {	//전체 소식갯수가 1개 ~3개면 2개만 등록
			
			int limit = Math.min(2, newsList.size()); // 추가 : 소식이 1개일 때는 0개 조회되는 오류 수정
			for(int i=0; i<limit; i++) {
				mainNewsList.add(newsList.get(i));
			}
		}
		
		return mainNewsList;
	}
}
