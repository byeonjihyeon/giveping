package kr.or.iei.biz.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.PageInfo;

@Mapper
public interface BizDao {

	int selectBoardCount();	// 전체 기부 사업 게시글 수 조회

	ArrayList<Biz> selectDonateBizList(PageInfo pageInfo);
	

}
