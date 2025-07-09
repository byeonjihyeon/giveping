package kr.or.iei.biz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SurveyQuestion {
private int questionNo;				//문항 번호
private String questionContent;		//문항 내용
private int questionWeight;			//문항별 반영 비율
}
