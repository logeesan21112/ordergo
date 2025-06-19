package com.quickman.ordermanagement.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ChargeRequest {
    private Long userId;
    private String expenseType;
    private BigDecimal expenseAmount;
    private String description;
}