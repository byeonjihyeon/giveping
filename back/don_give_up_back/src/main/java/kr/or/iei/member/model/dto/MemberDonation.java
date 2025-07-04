package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MemberDonation {
	private int donateNo;				//기부번호
	private String bizName;				//사업명
	private String orgName;				//단체명
	private String donateMoney;			//기부금액 (단위 9,999,999) 하고자 String
	private String donateDate;			//기부날짜
}
