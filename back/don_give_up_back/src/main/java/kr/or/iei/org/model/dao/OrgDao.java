package kr.or.iei.org.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.org.model.dto.Org;

@Mapper
public interface OrgDao {

	//아이디 중복체크
	int chkOrgId(String orgId);

	//단체 번호 조회
	int selectOrgNo();

	//회원가입
	int insertOrg(Org org);

	//단체 주요 카테고리 등록
	void insertOrgDonation(DonateCode dc);

}
