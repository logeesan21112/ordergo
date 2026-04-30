package com.ordergo.dtos;

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
public class DeliveryRequest {

    @Positive(message = "User id is required")
    private Long userId;

    @Positive(message = "Vendor id is required")
    private Long vendorId;

    private BigDecimal cardOrOnlinePayment;

    @Positive(message = "Delivery charge is required")
    private BigDecimal deliveryCharge;

    private String incomeType;
    private String paymentType;
    private String paymentStatus;
    private String location;
    private String description;
}