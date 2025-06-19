package com.quickman.ordermanagement.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionDTO {
    private Long id;
    private UserDTO user;
    private ProductDTO product;
    private BigDecimal deliveryCharge;
    private BigDecimal cardOrOnlinePayment;
    private String incomeType;
    private String paymentType;
    private String paymentStatus;
    private String location;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
}