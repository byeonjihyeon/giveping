package kr.or.iei.common.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.org.model.dto.Org;

@Component
public class JwtUtils {

	@Value("${jwt.secret-key}")
	private String jwtSecretKey;
	@Value("${jwt.expire-minute}")
	private int jwtExpireMinute;
	@Value("${jwt.expire-hour-refresh}")
	private int jwtExpireHourRefresh;
	
	
	//개인 회원 AccessToken 발급 메소드
	public String createMemberAccessToken(int memberNo, int memberLevel, String memberName) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		Calendar calendar = Calendar.getInstance();					//현재 시간
		Date startTime = calendar.getTime();						//현재 시간 == 유효 시작시간
		calendar.add(Calendar.MINUTE, jwtExpireMinute);				//현재 시간 + 10분 == 유효 만료시간
		Date expireTime = calendar.getTime();						//만료시간
		
		String accessToken = Jwts.builder()							 //builder를 이용해 토큰 생성
								 .issuedAt(startTime) 				 //시작시간
								 .expiration(expireTime) 			 //만료시간
								 .signWith(key) 					 //암호화 서명
								 .claim("memberNo", memberNo)		 //토큰 포함 정보 (key-value 형태)
								 .claim("memberLevel", memberLevel)  //토큰 포함 정보 (key-value 형태)
								 .claim("memberName", memberName)
								 .compact();						 //생성
		
		return accessToken;
	}
	
	
	//개인 회원 RefreshToken 발급 메소드
	public String createMemberRefreshToken(int memberNo, int memberLevel, String memberName) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		
		Calendar calendar = Calendar.getInstance();					
		Date startTime = calendar.getTime();						
		calendar.add(Calendar.HOUR, jwtExpireHourRefresh);				
		Date expireTime = calendar.getTime();						
		
		String refreshToken = Jwts.builder()							
								 .issuedAt(startTime) 				
								 .expiration(expireTime) 			
								 .signWith(key)
								 .claim("memberNo", memberNo)
								 .claim("memberLevel", memberLevel) 
								 .claim("memberName", memberName)
								 .compact();						 
		
		return refreshToken;
	}
	
	//개인 회원 토큰 검증 //
	public Object memberValidateToken(String token) {
		
		Member m = new Member();
		
		try {
			//1. 토큰 해석을 위한 암호화키 세팅
			SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
			
			//2. 토큰 해석
			Claims claims = (Claims) Jwts.parser()
											.verifyWith(key)	
											.build()
											.parse(token)		
											.getPayload();
			
			//3. 토큰에서 데이터 추출
			int memberNo = (int) claims.get("memberNo");
			int memberLevel = (int) claims.get("memberLevel");
			String memberName = (String) claims.get("memberName");
			
			m.setMemberNo(memberNo);
			m.setMemberLevel(memberLevel);				
			m.setMemberName(memberName);
			
			
		}catch(SignatureException e) { // 발급토큰과 요청토큰 불일치
				return HttpStatus.UNAUTHORIZED; //401코드
		}catch(Exception e) { //토큰 유효 시간 경과
			return HttpStatus.FORBIDDEN; //403 코드
		}
		
		return m;
		
	}
	
	
	
	//단체 회원 AccessToken 발급 메소드
	public String createOrgAccessToken(int orgNo, String orgName) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		Calendar calendar = Calendar.getInstance();					//현재 시간
		Date startTime = calendar.getTime();						//현재 시간 == 유효 시작시간
		calendar.add(Calendar.MINUTE, jwtExpireMinute);				//현재 시간 + 10분 == 유효 만료시간
		Date expireTime = calendar.getTime();						//만료시간
		
		String accessToken = Jwts.builder()							 //builder를 이용해 토큰 생성
								 .issuedAt(startTime) 				 //시작시간
								 .expiration(expireTime) 			 //만료시간
								 .signWith(key) 					 //암호화 서명
								 .claim("orgNo", orgNo)       		 //토큰 포함 정보 (key-value 형태)
								 .claim("orgName", orgName)
								 .compact();						 //생성
		
		return accessToken;
	}
	
	//단체 회원 RefreshToken 발급 메소드
	public String createOrgRefreshToken(int orgNo, String orgName) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		
		Calendar calendar = Calendar.getInstance();					
		Date startTime = calendar.getTime();						
		calendar.add(Calendar.HOUR, jwtExpireHourRefresh);				
		Date expireTime = calendar.getTime();						
		
		String refreshToken = Jwts.builder()							
								 .issuedAt(startTime) 				
								 .expiration(expireTime) 			
								 .signWith(key)
								 .claim("orgNo", orgNo)
								 .claim("orgName", orgName)
								 .compact();						 
		
		return refreshToken;
	}
	
	//단체 회원 토큰 검증 
	public Object orgValidateToken(String token) {
		
		Org o = new Org();
		
		try {
			//1. 토큰 해석을 위한 암호화키 세팅
			SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
			
			//2. 토큰 해석
			Claims claims = (Claims) Jwts.parser()
											.verifyWith(key)	
											.build()
											.parse(token)		
											.getPayload();
			
			//3. 토큰에서 데이터 추출
			int orgNo = (int) claims.get("orgNo");
			String orgName = (String) claims.get("orgName");
			
			o.setOrgNo(orgNo);
			o.setOrgName(orgName);
			
			
		}catch(SignatureException e) { // 발급토큰과 요청토큰 불일치
				return HttpStatus.UNAUTHORIZED; //401코드
		}catch(Exception e) { //토큰 유효 시간 경과
			return HttpStatus.FORBIDDEN; //403 코드
		}
		
		return o;
		
	}
}
