package kr.or.iei.biz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BizDonationList {
	
	private int donateNo;			//기부 번호
	private int bizNo;				//사업 번호
	private int memberNo;			//회원 번호
	private int donateMoney; 		//기부 금액
	private int donateDate;			//기부 일자

}
