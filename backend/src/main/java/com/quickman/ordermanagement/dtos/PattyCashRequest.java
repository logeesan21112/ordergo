package com.quickman.ordermanagement.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PattyCashRequest {
    private Long userId;
    private BigDecimal pattyCash;
    private LocalDateTime date;
}