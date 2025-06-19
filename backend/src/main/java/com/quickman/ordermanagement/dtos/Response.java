package com.quickman.ordermanagement.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.quickman.ordermanagement.enums.UserRole;

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
    private ProductDTO product;
    private List<ProductDTO> products;
    private TransactionDTO transaction;
    private List<TransactionDTO> transactions;
    private final LocalDateTime timestamp = LocalDateTime.now();
}