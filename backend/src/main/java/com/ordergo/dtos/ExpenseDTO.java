package com.ordergo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseDTO {

    private Long id;
    private Long userId;
    private String user;
    private String userImageUrl;
    private String expenseType;
    private String description;
    private BigDecimal expenseAmount;
    private LocalDateTime createdAt;
}