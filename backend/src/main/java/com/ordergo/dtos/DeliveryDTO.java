package com.ordergo.dtos;

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
public class DeliveryDTO {

    private Long id;
    private UserDTO user;
    private VendorDTO vendor;
    private BigDecimal deliveryCharge;
    private BigDecimal cardOrOnlinePayment;
    private String incomeType;
    private String paymentType;
    private String paymentStatus;
    private String location;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}