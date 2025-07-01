package kr.or.iei.news.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class News {
	private int newsNo;
	private int memberNo;
	private int orgNo;
	private String newsName;
	private String newsContent;
	private String newsThumbPath;
	private String newsDate;
	private String readCount;
	
	// join 을 위해 변수 추가
	private String memberName;
	private String orgName;
}
