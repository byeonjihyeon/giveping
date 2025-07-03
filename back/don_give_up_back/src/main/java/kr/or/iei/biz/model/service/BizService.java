package kr.or.iei.biz.model.service;

import java.beans.Transient;
import java.util.ArrayList;
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
		
		// 1. 상세 조회 시, 해당 사업에 기부한 회원 조회
		List<BizMember> bizMemberList = dao.selectDonateMember(bizNo);
		// 2. 기부 사업 상세 조회
	    Biz biz = dao.selectOneDonateBiz(bizNo);
	    
	    // 3. 1번에서 조회된 회원 리스트를 Biz 객체에 set
	    biz.setBizMemberList(bizMemberList);
		
		return biz;
	}

	public HashMap<String, Object> searchDonateBiz(Keyword keyword) {
		System.out.println(keyword.toString());
		int viewCnt = 12;						// 한 페이지 당 게시글 수
		int pageNaviSize = 5;					// 페이지 네비게이션 길이
		int totalcount = dao.selectSearchCount(keyword);//전체 게시글 수
		
		// 페이징 정보 (reqPage 임시로 1로 지정)
		PageInfo pageInfo = pageUtil.getPageInfo(1, viewCnt, pageNaviSize, totalcount);
		
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
	
	/*
	@Transactional
	public ArrayList<BizFile> regFile(Biz biz, ArrayList<BizFile> fileList) {

		int result = 1;
		int pkNo = 0; // BizFile 객체 안에 있는 pkNo 선언
		
		
		ArrayList<BizFile> delFileList = new ArrayList<BizFile>();
		
		System.out.println("biz.getDelBizFileNo : " + biz.getDelBizFileNo());
		// 화면에서 삭제 클릭하지 않았다면, null 이므로
			if(biz.getDelBizFileNo() != null) {
				delFileList = dao.selectDelBizFile(biz.getDelBizFileNo());
				int delResult = dao.deleteBizFile(biz.getDelBizFileNo());
				
				if(delResult < 1) {
					System.out.println("파일 삭제 실패");
					throw new RuntimeException("파일 삭제 실패");
				}
			}
			
	
		// biz 객체의 bizNo 변수로 tbl_no 에서 pk_no 찾아오기
		BizNo bizNo = dao.selectPk(biz);

		// 해당 pk_no 가 존재하지 않을 경우 => bizNo 객체는 null 값 반환 => tbl_no에 새롭게 insert 후 pk_no 값 다시 조회
		if (bizNo == null) {
			System.out.println("tbl_no 테이블에 없음!");
			int pkResult = dao.regPkNo(biz.getBizNo());
			if (pkResult > 0) {
				bizNo = dao.selectPk(biz);
				System.out.println("Biz 객체 :" + bizNo.toString());
			}
		}
		
		if(bizNo != null) {
			System.out.println("BizNo 객체: " + bizNo.toString());
			pkNo = bizNo.getPkNo();
			System.out.println("pk_no :" + pkNo);
		}else {
			System.out.println("pk_no 조회 실패");
			throw new RuntimeException("pk_no 조회 실패");
		}
		
		// pk_no 가 존재하는 경우 => tbl_file에 insert 작업 수행
		for (BizFile file : fileList) {
			file.setPkNo(pkNo); // pkNo 값을 BizFile 객체에 넣어서 전달
			System.out.println("BizFile 최종 set :" + file.toString());
			// tbl_file에 insert : insert 가 하나라도 안 될 경우 result 값 0으로 반환
			int insertResult = dao.insertBoardFile(file);
			if (insertResult == 0) {
				System.out.println("파일 insert 실패");
				throw new RuntimeException("파일 insert 실패");
			}
			
		}
		return delFileList;
	}
	*/

	public ArrayList<BizFile> selectBizFileList(int bizNo) {
		return dao.selectBizFileList(bizNo);
	}
}