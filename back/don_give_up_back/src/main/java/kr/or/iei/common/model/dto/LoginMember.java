package kr.or.iei.common.model.dto;

import kr.or.iei.member.model.dto.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginMember {
	
	private Member member;
	private String accessToken;
	private String refreshToken;
}
