package kr.or.iei.common.model.dto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommonOrg {
	private int orgNo;				//단체 번호
	private String orgId;			//단체 아이디
	private String orgPw;			//단체 비밀번호
	private String orgName;			//단체명
	private String orgBiznum;		//단체 사업자 번호
	private String orgPhone;		//단체 전화번호
	private String orgEmail;		//단체 이메일
	private String orgAddrMain;		//단체 주소
	private String orgAddrDetail;	//단체 상세 주소
	private String orgIntroduce;	//단체 설명
	private String orgAccount;		//단체 계좌번호
	private String orgAccountBank;	//단체 계좌번호 은행명
	private String orgEnrollDate;	//단체 가입일
	private double orgTemperature;	//단체 온도
	private int orgStatus;			//단체 상태(0:미승인, 1:승인, 2:반려, 3:탈퇴요청, 4:탈퇴)
	private String orgThumbPath;	//단체 썸네일 경로
	private String orgUrl;			//단체 홈페이지 url
	
	
	private List<String> categoryList;	//주요 카테고리 리스트
	//private List<Biz> bizList;			//기부사업 리스트

}
