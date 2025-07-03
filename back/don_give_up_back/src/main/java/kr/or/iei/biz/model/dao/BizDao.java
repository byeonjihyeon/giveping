package kr.or.iei.biz.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.Keyword;

@Mapper
public interface BizDao {

	int selectBoardCount(List<String> categories);	// 전체 기부 사업 게시글 수 조회

	ArrayList<Biz> selectDonateBizList(Map<String, Object> param);

	Biz selectOneDonateBiz(int bizNo);

	int selectSearchCount(Keyword keyword);

	ArrayList<Biz> selectSearchBizList(Keyword keyword);

	List<BizMember> selectDonateMember(int bizNo);

	BizMember selectMemberMoney(int memberNo);

	int bizDonate(BizDonationList bizDonationList);
	

}
