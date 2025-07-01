package kr.or.iei.common.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PatchMapping;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import kr.or.iei.member.model.dto.Member;

@Component
public class JwtUtils {

	@Value("${jwt.secret-key}")
	private String jwtSecretKey;
	@Value("${jwt.expire-minute}")
	private int jwtExpireMinute;
	@Value("${jwt.expire-hour-refresh}")
	private int jwtExpireHourRefresh;
	
	
	//AccessToken 발급 메소드
	public String createAccessToken(String memberId, int memberLevel) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		Calendar calendar = Calendar.getInstance();					//현재 시간
		Date startTime = calendar.getTime();						//현재 시간 == 유효 시작시간
		calendar.add(Calendar.MINUTE, jwtExpireMinute);				//현재 시간 + 10분 == 유효 만료시간
		Date expireTime = calendar.getTime();						//만료시간
		
		String accessToken = Jwts.builder()							 //builder를 이용해 토큰 생성
								 .issuedAt(startTime) 				 //시작시간
								 .expiration(expireTime) 			 //만료시간
								 .signWith(key) 					 //암호화 서명
								 .claim("memberId", memberId) 		 //토큰 포함 정보 (key-value 형태)
								 .claim("memberLevel", memberLevel)  //토큰 포함 정보 (key-value 형태)
								 .compact();						 //생성
		
		return accessToken;
	}
	
	
	//RefreshToken 발급 메소드
	public String createRefreshToken(String memberId, int memberLevel) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		
		Calendar calendar = Calendar.getInstance();					
		Date startTime = calendar.getTime();						
		calendar.add(Calendar.HOUR, jwtExpireHourRefresh);				
		Date expireTime = calendar.getTime();						
		
		String refreshToken = Jwts.builder()							
								 .issuedAt(startTime) 				
								 .expiration(expireTime) 			
								 .signWith(key) 					
								 .claim("memberId", memberId) 		
								 .claim("memberLevel", memberLevel) 
								 .compact();						 
		
		return refreshToken;
	}
	
	//토큰 검증 
	public Object validateToken(String token) {
		
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
			String memberId = (String) claims.get("memberId");
			int memberLevel = (int) claims.get("memberLevel");
			
			m.setMemberId(memberId);
			m.setMemberLevel(memberLevel);								
			
			
		}catch(SignatureException e) { // 발급토큰과 요청토큰 불일치
				return HttpStatus.UNAUTHORIZED; //401코드
		}catch(Exception e) { //토큰 유효 시간 경과
			return HttpStatus.FORBIDDEN; //403 코드
		}
		
		return m;
		
	}
	
	
	
}
