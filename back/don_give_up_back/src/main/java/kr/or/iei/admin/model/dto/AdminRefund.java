package kr.or.iei.admin.model.dto;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class AdminRefund {
  private int refundNo;              // 환불 번호
  private String memberName;         // 회원 이름
  private int refundMoney;        // 환불 금액
  private String memberAccount;      // 환불 계좌번호
  private String memberAccountBank;  // 환불 계좌번호 은행명
  private String refundDate;         // 환불 요청 일자
  private int refundStatus;          // 환불 완료 여부 (0 : 미완료, 1 : 완료)
  private LocalDateTime refundFinDate;      //환불 완료 일자(초기에는 null, 환불 완료 후 INSERT)
} 
