package kr.or.iei.common.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Alarm {
	
	private int alarmNo;
	private int memberNo;
	private int bizNo;
	private int alarmType;
	private String alarmDate;
	private int alarmRead;

}
