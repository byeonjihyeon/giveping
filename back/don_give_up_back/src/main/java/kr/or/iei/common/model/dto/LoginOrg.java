package kr.or.iei.common.model.dto;

import kr.or.iei.org.model.dto.Org;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginOrg {

	private Org org;
	private String accessToken;
	private String refreshToken;
}
