package kr.or.iei.biz.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizFile;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.BizPlan;
import kr.or.iei.biz.model.dto.BizNo;
import kr.or.iei.biz.model.dto.Keyword;
import kr.or.iei.biz.model.dto.SurveyAnswer;
import kr.or.iei.biz.model.dto.SurveyQuestion;

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

	ArrayList<SurveyQuestion> selectSurveyQuestion();

	int regSurveyAnswer(SurveyAnswer answer);

	BizNo selectPk(Biz biz);

	int regPkNo(int bizNo);

	ArrayList<BizFile> selectBizFileList(int bizNo);

	ArrayList<BizFile> selectDelBizFile(int[] delBizFileNo);

	int deleteBizFile(int[] delBizFileNo);

	// 사업 번호로 pkNo 조회
	BizNo getBizNoFromBizNo(Biz biz);

	// 첨부파일 추가
	void insertBizFile(BizFile file);
	
	//사업 번호 조회
	int selectBizNo();

	//대표 사진 업로드
	int uploadThumb(Biz biz);

	//기부 사업 등록
	int insertBiz(Biz biz);

	//모금액 사용 계획 등록
	int insertBizPlan(BizPlan bizPlan);

	// 첨부파일 다운로드
	BizFile selectBizFile(int bizFileNo);

	// 기부 사업 삭제 상태로 업데이트
	int deleteBiz(int bizNo);

	// 모금액 사용 계획 삭제
	int deleteBizPlans(List<Integer> deletedPlanNosList);

	// 기부 사업글 수정
	int updateBiz(Biz biz);

	// 모금액 사용 계획 수정
	int updateBizPlan(BizPlan plan);

	// 카테고리별 기부 사업 조회하기
	ArrayList<Biz> selectBizByCategory(int bizNo);

	

}
