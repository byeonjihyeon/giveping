package kr.or.iei.common.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.DonateCode;

@Mapper
public interface CommonDao {

	ArrayList<DonateCode> selectDonateCtg(); //기부 카테고리 조회

}
