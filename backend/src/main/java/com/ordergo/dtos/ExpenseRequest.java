package com.ordergo.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExpenseRequest {

    private Long userId;
    private String expenseType;
    private BigDecimal expenseAmount;
    private String description;
}