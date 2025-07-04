package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Refund {
	private int refundNo;				//출금번호
	private String refundMoney;			//출금액 (단위를 99,999,999로 표현하기 위해 타입 String)
	private String memberAccount;		//출금계좌
	private String memberAccountBank;	//은행명
	private String refundDate;			//출금날짜
}
