package kr.or.iei.common.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DonateCode {
	private String donateCode;	//기부 코드
	private String donateCtg;	//기부 카테고리
}
