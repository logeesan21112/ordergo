package com.ordergo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal deliveryCharge;
    private BigDecimal cardOrOnlinePayment;
    private String incomeType;
    private String paymentStatus;
    private String paymentType;
    private String description;
    private String location;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @Builder.Default
    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Override
    public String toString() {
        return "Delivery{" +
                "id=" + id +
                ", deliveryCharge=" + deliveryCharge +
                ", cardOrOnlinePayment=" + cardOrOnlinePayment +
                ", incomeType='" + incomeType + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", paymentType='" + paymentType + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", isDeleted=" + isDeleted +
                '}';
    }
}