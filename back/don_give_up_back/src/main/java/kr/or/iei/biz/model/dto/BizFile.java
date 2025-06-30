package kr.or.iei.biz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BizFile {
	
	private int bizFileNo;
	private int bizNo;
	private String fileName;
	private String filePath;

}
