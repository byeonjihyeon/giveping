package kr.or.iei.common.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.iei.common.exception.CommonException;
import kr.or.iei.common.util.JwtUtils;

@Component
@Aspect
public class ValidateAOP {
	
	//전체 컨트롤러
	@Pointcut("execution(* kr.or.iei.*.controller.*.*(..))") 
	public void allControllerPointcut() {}
	
	//개인 회원 컨트롤러
	@Pointcut("execution(* kr.or.iei.member.controller.*.*(..))") 
	public void memberControllerPointcut() {}
	
	//단체 회원 컨트롤러
	@Pointcut("execution(* kr.or.iei.org.controller.*.*(..))") 
	public void orgControllerPointcut() {}
	
	//관리자 컨트롤러
	@Pointcut("execution(* kr.or.iei.admin.controller.*.*(..))") 
	public void adminControllerPointcut() {}
	
	//사용자 정의 어노테이션 지정
	@Pointcut("@annotation(kr.or.iei.common.annotation.NoTokenCheck)")
	public void noTokenCheckAnnotation() {}
	
	@Autowired
	private JwtUtils jwtUtils;
	
	/*
	//모든 Controller 메소드중, noTokenCheck 어노테이션이 작성되지 않은 메소드가 실행되기 이전에, 수행할 공통 로직
	@Before("allControllerPointcut() && !noTokenCheckAnnotation()")
	public void validateTokenAop() {
		//요청 객체 얻어오기
		HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
		
		String uri = request.getRequestURI();
		
		//재발급 요청이면, refreshToken을 추출하고, 아니면 accessToken 추출
		String token = uri.endsWith("refresh")
						? request.getHeader("refreshToken")
						: request.getHeader("Authorization");
		
		//토큰 검증 메소드 호출
		Object resObj = jwtUtils.memberValidateToken(token);
		

			
		//토큰 검증 실패
		if(resObj instanceof HttpStatus OhttpStatus) {
			CommonException ex = new CommonException("invalid jwtToken in request Header");
			ex.setErrorCode(OhttpStatus); //401, 403 code
			throw ex; // 예외를 던짐 
		}
		
	}
	*/
	
	//MemberController 메소드중, noTokenCheck 어노테이션이 작성되지 않은 메소드가 실행되기 이전에, 수행할 공통 로직
	@Before("memberControllerPointcut() && !noTokenCheckAnnotation()")
	public void memberValidateTokenAop() {
		//요청 객체 얻어오기
		HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
		
		String uri = request.getRequestURI();
		
		//재발급 요청이면, refreshToken을 추출하고, 아니면 accessToken 추출
		String token = uri.endsWith("refresh")
						? request.getHeader("refreshToken")
						: request.getHeader("Authorization");
		
		//토큰 검증 메소드 호출
		Object resObj = jwtUtils.memberValidateToken(token);
		

			
		//토큰 검증 실패
		if(resObj instanceof HttpStatus OhttpStatus) {
			CommonException ex = new CommonException("invalid jwtToken in request Header");
			ex.setErrorCode(OhttpStatus); //401, 403 code
			throw ex; // 예외를 던짐 
		}
		
	}
	
	//OrgController 메소드중, noTokenCheck 어노테이션이 작성되지 않은 메소드가 실행되기 이전에, 수행할 공통 로직
	@Before("orgControllerPointcut() && !noTokenCheckAnnotation()")
	public void orgValidateTokenAop() {
		//요청 객체 얻어오기
		HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
		
		String uri = request.getRequestURI();
		
		//재발급 요청이면, refreshToken을 추출하고, 아니면 accessToken 추출
		String token = uri.endsWith("refresh")
						? request.getHeader("refreshToken")
						: request.getHeader("Authorization");
		
		//토큰 검증 메소드 호출
		Object resObj = jwtUtils.orgValidateToken(token);
		

			
		//토큰 검증 실패
		if(resObj instanceof HttpStatus OhttpStatus) {
			CommonException ex = new CommonException("invalid jwtToken in request Header");
			ex.setErrorCode(OhttpStatus); //401, 403 code
			throw ex; // 예외를 던짐 
		}
		
	}

	//AdminController 메소드중, noTokenCheck 어노테이션이 작성되지 않은 메소드가 실행되기 이전에, 수행할 공통 로직
	@Before("adminControllerPointcut() && !noTokenCheckAnnotation()")
	public void adminValidateTokenAop() {
		//요청 객체 얻어오기
		HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
		
		String uri = request.getRequestURI();
		
		//재발급 요청이면, refreshToken을 추출하고, 아니면 accessToken 추출
		String token = uri.endsWith("refresh")
						? request.getHeader("refreshToken")
						: request.getHeader("Authorization");
		
		//토큰 검증 메소드 호출
		Object resObj = jwtUtils.memberValidateToken(token);
		

			
		//토큰 검증 실패
		if(resObj instanceof HttpStatus OhttpStatus) {
			CommonException ex = new CommonException("invalid jwtToken in request Header");
			ex.setErrorCode(OhttpStatus); //401, 403 code
			throw ex; // 예외를 던짐 
		}
		
	}
}
