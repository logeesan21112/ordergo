package com.quickman.ordermanagement.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Column(unique = true)
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "address must not be blank")
    private String address;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    private String imageUrl;
    private boolean deleted = false;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", address=" + address +
                ", phoneNumber=" + phoneNumber +
                ", imageUrl='" + imageUrl + '\'' +
                ", deleted=" + deleted +
                ", createdAt=" + createdAt +
                '}';
    }
}