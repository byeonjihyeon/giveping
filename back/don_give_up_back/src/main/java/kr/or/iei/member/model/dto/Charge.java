package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Charge {
	private int chargNo;			//충전번호
	private String chargeMoney;		//충전금액 (단위를 99,999,999로 표현하기 위해 타입 String)
	private String chargeDate;		//충전날짜
}
