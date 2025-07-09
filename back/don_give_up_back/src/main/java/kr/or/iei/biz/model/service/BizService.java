package kr.or.iei.biz.model.service;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.biz.model.dao.BizDao;
import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.biz.model.dto.BizDonationList;
import kr.or.iei.biz.model.dto.BizFile;
import kr.or.iei.biz.model.dto.BizMember;
import kr.or.iei.biz.model.dto.BizPlan;
import kr.or.iei.biz.model.dto.BizNo;
import kr.or.iei.biz.model.dto.Keyword;
import kr.or.iei.biz.model.dto.SurveyAnswer;
import kr.or.iei.biz.model.dto.SurveyQuestion;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;

@Service
public class BizService {
	@Autowired
	private BizDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectDonateBizList(int reqPage, List<String> categories) {
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectBoardCount(categories);//전체 게시글 수
		
		// 페이징 정보
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);

		HashMap<String, Object> param = new HashMap<>();
		param.put("start", pageInfo.getStart());
		param.put("end", pageInfo.getEnd());
		param.put("categories", categories);
		
		// 게시글 목록 조회
		ArrayList<Biz> donateBizList = dao.selectDonateBizList(param);
		
		HashMap<String, Object> donateBizMap = new HashMap<String, Object>();
		donateBizMap.put("donateBizList", donateBizList);
		donateBizMap.put("pageInfo", pageInfo);
		
		return donateBizMap;
	}

	public Biz selectOneDonateBiz(int bizNo) {
		
		
		// 2. 기부 사업 상세 조회
	    Biz biz = dao.selectOneDonateBiz(bizNo);
	    
		
		return biz;
	}

	// 기부 단체 검색
	public HashMap<String, Object> searchDonateBiz(Keyword keyword, int reqPage) {
		
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectSearchCount(keyword);//전체 게시글 수
		
		// 페이징 정보 (reqPage 임시로 1로 지정)
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);
		
		keyword.setPageInfo(pageInfo);
		
		// 게시글 목록 조회
		ArrayList<Biz> donateBizList = dao.selectSearchBizList(keyword);
		
		HashMap<String, Object> donateBizMap = new HashMap<String, Object>();
		donateBizMap.put("donateBizList", donateBizList);
		donateBizMap.put("pageInfo", pageInfo);
		
		return donateBizMap;
	}

	public BizMember selectMemberMoney(int memberNo) {
		return dao.selectMemberMoney(memberNo);
	}

	@Transactional
	public int bizDonate(BizDonationList bizDonationList) {
		return dao.bizDonate(bizDonationList);
	}

	public ArrayList<SurveyQuestion> selectSurveyQuestion() {
		return dao.selectSurveyQuestion();
	}

	@Transactional
	public int regSurveyAnswer(List<SurveyAnswer> answerList) {
		int result = 0;
		for(SurveyAnswer answer : answerList) {
			result += dao.regSurveyAnswer(answer);
		}
		return result;
	}

	//대표 사진 업로드
	@Transactional
	public Biz uploadThumb(Biz biz) {
		//1) 사업 번호 조회
		int bizNo = dao.selectBizNo();
		biz.setBizNo(bizNo);
		
		//2) 대표 사진 업로드
		int result = dao.uploadThumb(biz);
		
		return biz;
	}

	//기부 사업 등록
	public int insertBiz(Biz biz) {
		//1) 기부 사업 등록
		int result = dao.insertBiz(biz);
		
		//2) 모금액 사용 계획 등록
		if(result > 0) {			
			for(int i=0; i<biz.getBizPlanList().size(); i++) {
				BizPlan bizPlan = biz.getBizPlanList().get(i);
				bizPlan.setBizNo(biz.getBizNo());
				result = dao.insertBizPlan(bizPlan);
			}
		}
		
		return result;
	}

	
	/*
	public ArrayList<BizFile> selectBizFileList(int bizNo) {
		return dao.selectBizFileList(bizNo);
	}
	*/

	@Transactional
	// 첨부파일 등록 / 수정 / 삭제
		public ArrayList<BizFile> updateFile(Biz biz) {
			// 1. Biz 객체의 bizNo 로 tbl_no 에서 pk_no 조회해오기
			BizNo bizNoObj = dao.selectPk(biz);
			int pkNo = 0;
					
			//2. pk_no 없을 경우 tbl_no 에서 새로 생성
			if (bizNoObj == null) {
				dao.regPkNo(biz.getBizNo());	// pk_no 값 생성
				//2.2. 새로 생성한 pk_no 를 Biz 객체의 bizNo로 tbl_no에서 다시 조회
				bizNoObj = dao.selectPk(biz);	// pk 값 다시 조회
				if (bizNoObj == null) {
		            throw new RuntimeException("PK 생성 및 조회 실패");
		        }	
			}
			
			pkNo = bizNoObj.getPkNo();	// 조회한 pkNo 변수에 저장
			
			// 각 BizFile 에 pkNo 재설정
			List<BizFile> fileList = biz.getFileList();
		    if (fileList != null) {
		        for (BizFile file : fileList) {
		            file.setPkNo(pkNo); // 위에서 조회한 pkNo로 pkNo 다시 세팅
		        }
		    }		
		    
			
			//3. pk_no 값 얻었을 때 -> 첨부파일 삭제 / 등록 처리
			// 먼저 biz의 fileList 의 pkNo 값을 bizNo의 getPkNo 해서 다시 세팅
			
			ArrayList<BizFile> delFileList = new ArrayList<BizFile>();	
			
			//3.2. 첨부파일 삭제 처리
			// 화면에서 삭제 클릭하지 않았다면, delBizFileNo값이 null 이므로 파일 삭제 처리 하지 않음
			if(biz.getDelBizFileNo() != null) {
				// 서버에서 삭제할 파일 리스트 조회
				delFileList = dao.selectDelBizFile(biz.getDelBizFileNo());
				// 삭제할 파일 정보 DB에서 삭제
				dao.deleteBizFile(biz.getDelBizFileNo());
			}
			
			// 3.3. 추가 첨부파일 등록 처리
			if(biz.getFileList() != null) {
				for (BizFile file : fileList) {
		            dao.insertBizFile(file);
		        }
			}
			
			return delFileList;
		}

		// 사업 번호로 pkNo 조회하는 메서드
		public BizNo getBizNoFromBizNo(Biz biz) {
			return dao.selectPk(biz);
		}

		// 첨부파일 다운로드
		public BizFile selectBizFile(int bizFileNo) {
			return dao.selectBizFile(bizFileNo);
		}
	
	
}
