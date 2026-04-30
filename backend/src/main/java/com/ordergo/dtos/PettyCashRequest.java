package com.ordergo.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PettyCashRequest {

    private Long userId;
    private BigDecimal pettyCash;
}