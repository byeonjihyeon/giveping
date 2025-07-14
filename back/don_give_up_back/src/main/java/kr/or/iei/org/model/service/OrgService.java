package kr.or.iei.org.model.service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.biz.model.dto.Biz;
import kr.or.iei.common.model.dto.DonateCode;
import kr.or.iei.common.model.dto.LoginOrg;
import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.member.model.dto.MemberAlarm;
import kr.or.iei.org.model.dao.OrgDao;
import kr.or.iei.org.model.dto.Org;

@Service
public class OrgService {
	@Autowired
	private OrgDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private PageUtil pageUtil;
	
	@Autowired
	private JavaMailSender mailSender;

	//토큰 재발급
	public String refreshToken(Org org) {
		//accessToken 재발급 처리
		String accessToken = jwtUtils.createOrgAccessToken(org.getOrgNo(), org.getOrgName());
		return accessToken;
	}
	
	//아이디 중복체크
	public int chkOrgId(String orgId) {
		return dao.chkOrgId(orgId);
	}

	//회원가입
	@Transactional
	public int insertOrg(Org org) {
		//1) 비밀번호 암호화
		String encodePw = encoder.encode(org.getOrgPw());
		org.setOrgPw(encodePw);
		
		//2) 단체 번호 조회
		int orgNo = dao.selectOrgNo();
		org.setOrgNo(orgNo);
		
		//2) 회원가입
		int result = dao.insertOrg(org);
		
		//3) 가입한 단체의 주요 카테고리 등록
		if(result > 0 && org.getCategoryList() != null) {
			DonateCode dc = new DonateCode();
			for(int i=0; i<org.getCategoryList().size(); i++) {
				String code = org.getCategoryList().get(i);
				dc.setDonateCode(code);
				dc.setOrgNo(orgNo);
				dao.insertOrgDonation(dc);
			}
		}
		return result;
	}

	//로그인
	public LoginOrg orgLogin(Org org) {
		//1) 아이디만을 가지고 회원 정보 조회
		Org chkOrg = dao.orgLogin(org.getOrgId()); //회원 번호, 비밀번호, 등급 추출
		
		//2) 평문 비밀번호와 암호화된 비밀번호 비교
		//아이디 잘못 입력하여 chkOrg가 null인 경우 비밀번호 검증 불필요
		if(chkOrg == null) {
			return null;
		}
		
		if(encoder.matches(org.getOrgPw(), chkOrg.getOrgPw())) { //평문 비밀번호 == 암호화 비밀번호
			String accessToken = jwtUtils.createOrgAccessToken(chkOrg.getOrgNo(), chkOrg.getOrgName());
			String refreshToken = jwtUtils.createOrgRefreshToken(chkOrg.getOrgNo(), chkOrg.getOrgName());
			
			//스토리지에 저장되지 않도록 처리(비밀번호 검증 이외에 필요가 없으므로)
			chkOrg.setOrgPw(null);
			
			//LoginOrg 객체에 저장해서 반환
			LoginOrg loginOrg = new LoginOrg(chkOrg, accessToken, refreshToken);
			
			return loginOrg;
		}else {
			//평문 비밀번호 != 암호화 비밀번호
			return null;
		}
	}

	//단체 1개 정보 조회
	public Org selectOneOrg(int orgNo) {
		Org org = new Org();
		
		//1) tbl_org에서 단체 정보 조회
		org = dao.selectOneOrg(orgNo);
		
		//2) tbl_org_donation에서 단체 주요 카테고리 조회
		List<String> categoryList = dao.selectOrgDonation(orgNo);
		
		org.setCategoryList(categoryList);
		
		return org;
	}

	//단체 정보 수정
	@Transactional
	public int updateOrg(Org org) {
		//1) tbl_org에서 단체 정보 수정
		int result = dao.updateOrg(org);
		
		if(result > 0 && org.getCategoryList() != null) {
		//2) tbl_org_donation에서 기존 단체 주요 카테고리 삭제
			dao.deleteOrgDonation(org.getOrgNo());
		
		//3) tbl_org_donation에서 새로운 단체 주요 카테고리 등록 
			DonateCode dc = new DonateCode();
			for(int i=0; i<org.getCategoryList().size(); i++) {
				String code = org.getCategoryList().get(i);
				dc.setDonateCode(code);
				dc.setOrgNo(org.getOrgNo());
				dao.insertOrgDonation(dc);
			}
		}
		
		return result;
	}

	//비밀번호 확인
	public int checkPw(Org org) {
		int result = 0;
		
		//1) 암호화된 비밀번호 가지고 오기
		String encodePw = dao.checkPw(org.getOrgNo());
		
		//2) 평문 비밀번호 == 암호화 비밀번호인지 확인
		if(encoder.matches(org.getOrgPw(), encodePw)) {
			result = 1; //일치하면 결과값 1로 변경
		}
		
		return result;
	}

	//비밀번호 변경
	@Transactional
	public int updatePw(int orgNo, String newOrgPw) {
		//1) 비밀번호 암호화
		String encodePw = encoder.encode(newOrgPw);
		
		//2) 비밀번호 변경
		Org org = new Org();
		org.setOrgNo(orgNo);
		org.setOrgPw(encodePw);
		
		int result = dao.updatePw(org);
		
		return result;
	}

	//단체 프로필 초기화(삭제)
	@Transactional
	public int deleteThumb(int orgNo) {
		return dao.deleteThumb(orgNo);
	}

	//단체 프로필 수정
	@Transactional
	public int updateThumb(Org org) {
		return dao.updateThumb(org);
	}

	
   //기부 사업 조회
   public HashMap<String, Object> selectBizList(int reqPage, Biz biz) {
      //1) 페이지 정보
      int viewCnt = 10;                         //한 페이지 당 기부 사업 갯수
      int pageNaviSize = 5;                    	//페이지 네비게이션 길이
      int totalcount = dao.selectBizCount(biz);	//기부 사업 갯수 조회
      
      PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalcount);
      
      HashMap<String, Object> param = new HashMap<String, Object>();
      param.put("start", pageInfo.getStart());
      param.put("end", pageInfo.getEnd());
      param.put("clickBtn", biz.getClickBtn());
      param.put("orgNo", biz.getOrgNo());
      
      //2) 각 버튼 클릭 시 기부 사업 리스트 조회
      ArrayList<Biz> bizList = dao.selectBizList(param);
      
      HashMap<String, Object> bizMap = new HashMap<String, Object>();
      bizMap.put("bizList", bizList);
      bizMap.put("pageInfo", pageInfo);
      
      return bizMap;
   }

   //단체 아이디 찾기
   public String selectOrgId(Org org) {
	   return dao.selectOrgId(org);
   }

   //단체 비밀번호 찾기
   public int selectOrgPw(Org org) {
	   //1) 단체 비밀번호 찾기
	   int result = dao.selectOrgPw(org);
	   
	   if(result > 0) {
			//임시 비밀번호 10자리 : 영대/소문자, 숫자, 특수문자
			String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			String lower = "abcdefghijklmnopqrstuvwxyz";
			String digit = "0123456789";
			String special = "!@#$";
			
			String allChar = upper + lower + digit + special;
			
			SecureRandom random = new SecureRandom(); //난수 발생 객체
			StringBuilder randomPw = new StringBuilder(); //임시 비밀번호 10자리 저장 객체
			
			//각각 최소 1개씩 임시 비밀번호에 포함되도록 처리
			randomPw.append(upper.charAt(random.nextInt(upper.length())));
			randomPw.append(lower.charAt(random.nextInt(lower.length())));
			randomPw.append(digit.charAt(random.nextInt(digit.length())));
			randomPw.append(special.charAt(random.nextInt(special.length())));
			
			//위에서 4자리 추가 후 나머지 6자리 임시 비밀번호 발행 처리
			for(int i=0; i<6; i++) {
				//전체 문자열에 무작위 추출하여 추가
				randomPw.append(allChar.charAt(random.nextInt(allChar.length())));
			}
			
			//발행된 임시 비밀번호 10자리를 무작위로 섞기기
			char [] charArr = randomPw.toString().toCharArray();
			for(int i=0; i<charArr.length; i++) {
				int randomIdx = random.nextInt(charArr.length);
				
				char temp = charArr[i];
				charArr[i] = charArr[randomIdx];
				charArr[randomIdx] = temp;
			}
			
			//최종 임시 비밀번호
			String newRandomPw = new String(charArr);
			
			System.out.println(newRandomPw);
			
			//메일로 보낼 메시지
			SimpleMailMessage msg = new SimpleMailMessage();
			msg.setTo("qor659659@gmail.com"); //메일을 받을 메일 주소 org.getOrgEmail();
			msg.setFrom("dongiveup00@gmail.com");
			msg.setSubject("Don Give Up 임시 비밀번호 안내");
			msg.setText(org.getOrgId() + "님의 임시 비밀번호는 " + newRandomPw + " 입니다.");
			
			mailSender.send(msg);
			
			String encodePw = encoder.encode(newRandomPw);
			org.setOrgPw(encodePw);
			
			//2) 임시 비밀번호로 변경
			dao.updateRandomPw(org);
	   }
	   
	   return result;
   }
	// 단체 알림 리스트 조회
	public ArrayList<MemberAlarm> selectOrgAlarmList(int orgNo) {
		return dao.selectOrgAlarmList(orgNo);
	}

	//단체 알림 읽음 처리
	@Transactional
	public int updateAlarmRead(int alarmNo) {
		return dao.updateAlarmRead(alarmNo);
	}

	//탈퇴하기 페이지에서 조회할 기부 사업 리스트
	public ArrayList<Biz> selectIngBizList(int orgNo) {
		return dao.selectIngBizList(orgNo);
	}

	//탈퇴 신청
	public int deleteOrg(int orgNo) {
		return dao.deleteOrg(orgNo);
	}

	//기부 사업 통계
	public HashMap<String, Object> selectBizData(int orgNo) {
		//전체 기부 사업 갯수
		int allBiz = dao.selectAllBiz(orgNo);
		//미승인 기부 사업 갯수
		int notApproveBiz = dao.selectNotApproveBiz(orgNo);
		//반려된 기부 사업 갯수
		int rejectBiz = dao.selectRejectBiz(orgNo);
		//승인된 기부 사업 갯수
		int approveBiz = dao.selectApproveBiz(orgNo);
		//진행 중인 기부 사업 갯수
		int ingBiz = dao.selectIngBiz(orgNo);
		//모금 종료된 기부 사업 갯수
		int donateEndBiz = dao.selectDonateEndBiz(orgNo);
		//사업 종료된 기부 사업 갯수
		int endBiz = dao.selectEndBiz(orgNo);
		//입금 처리된 기부 사업 갯수
		int payEndBiz = dao.selectPayEndBiz(orgNo);
		//카테고리별 기부 사업 갯수
		ArrayList<DonateCode> donateCodeCnt = dao.selectDonateCodeCnt(orgNo);
		//기부 사업별 모금액
		ArrayList<Biz> donateMoneyList = dao.selectDonateMoneyList(orgNo);
		
		HashMap<String, Object> bizMap = new HashMap<String, Object>();
		bizMap.put("allBiz", allBiz);
		bizMap.put("notApproveBiz", notApproveBiz);
		bizMap.put("rejectBiz", rejectBiz);
		bizMap.put("approveBiz", approveBiz);
		bizMap.put("ingBiz", ingBiz);
		bizMap.put("donateEndBiz", donateEndBiz);
		bizMap.put("endBiz", endBiz);
		bizMap.put("payEndBiz", payEndBiz);
		bizMap.put("donateCodeCnt", donateCodeCnt);
		bizMap.put("donateMoneyList", donateMoneyList);
		
		return bizMap;
	}

	//단체 마이페이지 메인에 보여질 정보 조회
	public HashMap<String, Object> selectOrgMain(int orgNo) {
		//오늘 모인 기부금
		Biz biz = dao.selectTodayDonate(orgNo);
		int todayDonate = 0;
		if(biz != null) {
			todayDonate = biz.getDonateMoney();
		}
		//관심 회원 수
		int likeMember = dao.selectLikeMember(orgNo);
		//단체 주요 카테고리명
		List<String> categoryList = dao.selectOrgCategory(orgNo);
		//승인된 최근 기부 사업 리스트 5개 조회
		ArrayList<Biz> bizList = dao.selectCurrentBizList(orgNo);
		
		HashMap<String, Object> orgMap = new HashMap<String, Object>();
		orgMap.put("todayDonate", todayDonate);
		orgMap.put("likeMember", likeMember);
		orgMap.put("categoryList", categoryList);
		orgMap.put("bizList", bizList);
		
		return orgMap;
	}

	//단체 목록 페이지
	public HashMap<String, Object> selectOrgList(int reqPage) {
		int viewCnt = 10;   //한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 보여줌)
		int pageNaviSize = 5;    //페이지 네비게이션 길이
		int totalCount =dao.selectOrgCount();
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);	
		
		
		ArrayList<Org> orgList = dao.selectOrgList(reqPage);
		System.out.println("단체목록"+ orgList);
		
	    for (Org org : orgList) {
	        List<String> categoryList = dao.selectOrgCategory(org.getOrgNo());
	        org.setCategoryList(categoryList); 
	    }
		HashMap<String, Object> orgMap = new HashMap<String, Object>();
		orgMap.put("orgList", orgList);
		orgMap.put("pageInfo", pageInfo);
		
	
		System.out.println("단체목록"+ orgList);
	    
		return orgMap;
	}

		
}

