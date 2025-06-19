package com.quickman.ordermanagement.models;

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
@Table(name = "transaction")
public class Transaction {
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

    private final LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updateAt;
    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", deliveryCharge=" + deliveryCharge +
                ", cardOrOnlinePayment=" + cardOrOnlinePayment +
                ", incomeType='" + incomeType + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", paymentType='" + paymentType + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", createdAt=" + createdAt +
                ", updateAt=" + updateAt +
                ", isDeleted=" + isDeleted +
                '}';
    }
}