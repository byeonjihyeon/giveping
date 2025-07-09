package kr.or.iei.biz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BizFile {
	
	private int fileNo;
	private int pkNo;
	private String fileName;
	private String filePath;
	
	// 조인을 위한 변수 선언
	private int bizNo;

}
