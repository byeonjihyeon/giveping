package kr.or.iei.member.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateMember {
	private Member member;					//업데이트할 회원 정보를 가진 변수
	private List<String> delCategory;		//기존에서 제거해야될 카테고리 리스트
	private List<String> addCategory;		//추가해야할 카테고리 리스트
}
