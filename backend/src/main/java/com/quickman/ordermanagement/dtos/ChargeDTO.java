package com.quickman.ordermanagement.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargeDTO {
    private Long id;
    private String user;
    private String expenseType;
    private String description;
    private BigDecimal expenseAmount;
    private LocalDateTime date;
}