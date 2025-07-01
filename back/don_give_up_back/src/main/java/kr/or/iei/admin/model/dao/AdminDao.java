package kr.or.iei.admin.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.org.model.dto.Org;

@Mapper
public interface AdminDao {

	int selectMemberCount();

	ArrayList<Member> selectMemberList(PageInfo pageInfo);
	
	int selectOrgCount();
	
	ArrayList<Org> selectOrgList(PageInfo pageInfo);



}
