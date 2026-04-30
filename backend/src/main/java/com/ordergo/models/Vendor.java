package com.ordergo.models;

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
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{9}", message = "Phone number must be exactly 9 digits")
    private String phoneNumber;

    private String imageUrl;

    @Builder.Default
    private boolean isDeleted = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public String toString() {
        return "Vendor{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", isDeleted=" + isDeleted +
                ", createdAt=" + createdAt +
                '}';
    }
}