package kr.or.iei.news.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewsFile {
	private int fileNo;	// 파일 번호 (시퀀스)
	private int pkNo;	// 식별 번호 () => file 테이블 insert 한 후에, tbl_no에 org_no 값 안에 단체 번호 넣고 insert
	private String fileName;	// 파일명
	private String filePath;	// 파일 경로

}
