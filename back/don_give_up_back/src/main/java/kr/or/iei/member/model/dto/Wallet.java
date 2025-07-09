package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Wallet {
	private String type;						//'charge' or 'refund'
	private int no;								//충전번호 or 환불번호			
	private String money;						//금액 (단위 지정하고자 String 지정)
	private String transDate;					//충전일자 or 환불신청일자
	private String refundFinDate;				//환불완료일자
	private String memberAccount;				//환불계좌
	private String memberAccountBank;			//환불계좌 은행명
}
