package com.quickman.ordermanagement.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class Charge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String expenseType;
    private BigDecimal expenseAmount;
    private String description;
    private final LocalDateTime date = LocalDateTime.now();
    
    @Column(name = "is_deleted")
    private boolean isDeleted = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}