package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class AdminPayout {

	private int payoutNo;
	private String orgName;
	private String bizName;
	private String bizDonateEnd;
	private int bizGoal;
	private int payoutAmount;
	private int payoutStatus;
	private String payoutDate;
	
	
}
