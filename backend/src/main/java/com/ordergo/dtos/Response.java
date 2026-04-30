package com.ordergo.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ordergo.enums.UserRole;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int status;
    private String message;
    private String token;
    private UserRole role;
    private String expirationTime;
    private Integer totalPages;
    private Long totalElements;

    private UserDTO user;
    private List<UserDTO> users;

    private VendorDTO vendor;
    private List<VendorDTO> vendors;

    private DeliveryDTO delivery;
    private List<DeliveryDTO> deliveries;

    private ExpenseDTO expense;
    private List<ExpenseDTO> expenses;

    private final LocalDateTime timestamp = LocalDateTime.now();
}