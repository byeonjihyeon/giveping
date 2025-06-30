package kr.or.iei.biz.model.dto;

import java.util.List;

import kr.or.iei.common.model.dto.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Keyword {
	private String bizTitle;
	private String orgName;
	private int reqPage;
	
	private PageInfo pageInfo;
}
