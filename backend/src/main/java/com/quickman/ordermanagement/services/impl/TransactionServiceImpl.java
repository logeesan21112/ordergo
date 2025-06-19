package com.quickman.ordermanagement.services.impl;

import com.quickman.ordermanagement.dtos.*;
import com.quickman.ordermanagement.exceptions.NotFoundException;
import com.quickman.ordermanagement.models.*;
import com.quickman.ordermanagement.repositories.*;
import com.quickman.ordermanagement.services.TransactionService;
import com.quickman.ordermanagement.specification.TransactionFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response sell(TransactionRequest transactionRequest) {
        Product product = productRepository.findById(transactionRequest.getProductId())
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        User user = userRepository.findById(transactionRequest.getUserId())
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        Transaction transaction = Transaction.builder()
                .incomeType(transactionRequest.getIncomeType())
                .paymentStatus(transactionRequest.getPaymentStatus())
                .paymentType(transactionRequest.getPaymentType())
                .product(product)
                .user(user)
                .deliveryCharge(transactionRequest.getDeliveryCharge())
                .cardOrOnlinePayment(transactionRequest.getCardOrOnlinePayment())
                .description(transactionRequest.getDescription())
                .location(transactionRequest.getLocation())
                .updateAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Product Sale successfully made")
                .build();
    }

    @Override
    public Response getAllTransactions(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Specification<Transaction> spec = TransactionFilter.byFilter(filter);
        Specification<Transaction> notDeleted = (root, query, cb) -> cb.isFalse(root.get("isDeleted"));
        spec = spec == null ? notDeleted : spec.and(notDeleted);

        Page<Transaction> transactionPage = transactionRepository.findAll(spec, pageable);
        List<TransactionDTO> transactionDTOS = transactionPage.getContent().stream()
            .map(this::mapToTransactionDTO)
            .toList();

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .totalElements(transactionPage.getTotalElements())
                .totalPages(transactionPage.getTotalPages())
                .build();
    }

    @Override
    public Response getAllTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));
        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);
        transactionDTO.getUser().setTransactions(null);

        return Response.builder()
                .status(200)
                .message("success")
                .transaction(transactionDTO)
                .build();
    }

    @Override
    public Response getAllTransactionByMonthAndYear(int month, int year) {
        List<Transaction> transactions = transactionRepository.findAll(TransactionFilter.byMonthAndYear(month, year));
        List<TransactionDTO> transactionDTOS = modelMapper.map(transactions, new TypeToken<List<TransactionDTO>>() {}.getType());
        transactionDTOS.forEach(dto -> {
            dto.setUser(null);
            dto.setProduct(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .build();
    }

    @Override
    public Response updateTransactionStatus(Long transactionId, String transactionStatus) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));
        transaction.setPaymentStatus(transactionStatus);
        transaction.setUpdateAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction Status Successfully Updated")
                .build();
    }

    @Override
    public Response getAllTransactionLocations() {
        List<TransactionDTO> locationDTOs = transactionRepository.findAll().stream()
                .map(tx -> TransactionDTO.builder().location(tx.getLocation()).build())
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Fetched transaction locations successfully")
                .transactions(locationDTOs)
                .build();
    }

    @Override
    public Response updateTransaction(Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));

        if (request.getDeliveryCharge() != null) transaction.setDeliveryCharge(request.getDeliveryCharge());
        if (request.getCardOrOnlinePayment() != null) transaction.setCardOrOnlinePayment(request.getCardOrOnlinePayment());
        if (request.getIncomeType() != null && !request.getIncomeType().isBlank()) transaction.setIncomeType(request.getIncomeType());
        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) transaction.setPaymentStatus(request.getPaymentStatus());
        if (request.getPaymentType() != null && !request.getPaymentType().isBlank()) transaction.setPaymentType(request.getPaymentType());
        if (request.getDescription() != null && !request.getDescription().isBlank()) transaction.setDescription(request.getDescription());
        if (request.getLocation() != null && !request.getLocation().isBlank()) transaction.setLocation(request.getLocation());

        transaction.setUpdateAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction updated successfully")
                .build();
    }

    @Override
    public Response deleteTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found with ID: " + transactionId));
        transaction.setDeleted(true);
        transaction.setUpdateAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction deleted successfully (soft deleted)")
                .build();
    }

    private TransactionDTO mapToTransactionDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setDeliveryCharge(transaction.getDeliveryCharge());
        dto.setCardOrOnlinePayment(transaction.getCardOrOnlinePayment());
        dto.setIncomeType(transaction.getIncomeType());
        dto.setPaymentStatus(transaction.getPaymentStatus());
        dto.setPaymentType(transaction.getPaymentType());
        dto.setDescription(transaction.getDescription());
        dto.setLocation(transaction.getLocation());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdateAt(transaction.getUpdateAt());

        if (transaction.getUser() != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setName(transaction.getUser().getName());
            dto.setUser(userDTO);
        }
        if (transaction.getProduct() != null) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(transaction.getProduct().getName());
            dto.setProduct(productDTO);
        }

        return dto;
    }
}