package com.ordergo.services;

import java.util.List;
import com.ordergo.dtos.ExpenseDTO;
import com.ordergo.dtos.ExpenseRequest;

public interface ExpenseService {

    ExpenseDTO addExpense(ExpenseRequest request);
    List<ExpenseDTO> getAllExpenses();
    ExpenseDTO updateExpense(Long id, ExpenseRequest request);
    void deleteExpense(Long id);
}