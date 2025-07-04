package kr.or.iei.biz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BizPlan {
	private int planNo;				//계획 번호
	private int bizNo;				//사업 번호
	private String bizPlanPurpose;	//사용 용도 및 산출 근거
	private int bizPlanMoney;		//비용
}
