package com.quickman.ordermanagement.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionRequest {
    @Positive(message = "user id is required")
    private Long userId;

    @Positive(message = "product id is required")
    private Long productId;

    private BigDecimal cardOrOnlinePayment;

    @Positive(message = "deliveryCharge is required")
    private BigDecimal deliveryCharge;

    private String incomeType;
    private String paymentType;
    private String paymentStatus;
    private String location;
    private String description;
}