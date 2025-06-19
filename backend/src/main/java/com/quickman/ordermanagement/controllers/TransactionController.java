package com.quickman.ordermanagement.controllers;

import com.quickman.ordermanagement.dtos.Response;
import com.quickman.ordermanagement.dtos.TransactionRequest;
import com.quickman.ordermanagement.services.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/sell")
    public ResponseEntity<Response> makeSale(@RequestBody @Valid TransactionRequest transactionRequest) {
        return ResponseEntity.ok(transactionService.sell(transactionRequest));
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(required = false) String filter) {
        return ResponseEntity.ok(transactionService.getAllTransactions(page, size, filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getAllTransactionById(id));
    }

    @GetMapping("/by-month-year")
    public ResponseEntity<Response> getTransactionByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(transactionService.getAllTransactionByMonthAndYear(month, year));
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<Response> updateTransactionStatus(
            @PathVariable Long transactionId,
            @RequestBody String transactionStatus) {
        return ResponseEntity.ok(transactionService.updateTransactionStatus(transactionId, transactionStatus));
    }

    @GetMapping("/locations")
    public Response getAllLocations() {
        return transactionService.getAllTransactionLocations();
    }

    @PutMapping("/update/{transactionId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateTransaction(
            @PathVariable Long transactionId,
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.updateTransaction(transactionId, request));
    }

    @DeleteMapping("/delete/{transactionId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(transactionService.deleteTransactionById(transactionId));
    }
    
}