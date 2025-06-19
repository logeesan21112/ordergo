package com.quickman.ordermanagement.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewDTO {
    private Long userId;
    private String userName;
    private LocalDateTime date;
    private BigDecimal totalDeliveryCharge;
    private BigDecimal totalCardOrOnlinePayment;
    private BigDecimal totalPattyCash;
    private BigDecimal totalExpenses;
    private BigDecimal balanceAmount;
}