package com.quickman.ordermanagement.services;

import com.quickman.ordermanagement.dtos.Response;
import com.quickman.ordermanagement.dtos.TransactionRequest;

public interface TransactionService {
    Response sell(TransactionRequest transactionRequest);
    Response getAllTransactions(int page, int size, String filter);
    Response getAllTransactionById(Long id);
    Response getAllTransactionByMonthAndYear(int month, int year);
    Response updateTransactionStatus(Long transactionId, String transactionStatus);
    Response getAllTransactionLocations();
    Response updateTransaction(Long transactionId, TransactionRequest request);
    Response deleteTransactionById(Long transactionId);
}