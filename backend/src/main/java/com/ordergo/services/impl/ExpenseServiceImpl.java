package com.ordergo.services.impl;

import com.ordergo.dtos.ExpenseDTO;
import com.ordergo.dtos.ExpenseRequest;
import com.ordergo.exceptions.NotFoundException;
import com.ordergo.models.Expense;
import com.ordergo.models.User;
import com.ordergo.repositories.ExpenseRepository;
import com.ordergo.repositories.UserRepository;
import com.ordergo.services.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private ExpenseDTO mapToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setUser(expense.getUser().getName());
        dto.setUserId(expense.getUser().getId());
        dto.setUserImageUrl(expense.getUser().getImageUrl());
        dto.setExpenseType(expense.getExpenseType());
        dto.setDescription(expense.getDescription());
        dto.setExpenseAmount(expense.getExpenseAmount());
        dto.setCreatedAt(expense.getCreatedAt());
        return dto;
    }

    @Override
    public ExpenseDTO addExpense(ExpenseRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setExpenseType(request.getExpenseType());
        expense.setExpenseAmount(request.getExpenseAmount());
        expense.setDescription(request.getDescription());

        return mapToDTO(expenseRepository.save(expense));
    }

    @Override
    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .filter(expense -> !expense.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseDTO updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        expense.setUser(user);
        expense.setExpenseType(request.getExpenseType());
        expense.setExpenseAmount(request.getExpenseAmount());
        expense.setDescription(request.getDescription());

        return mapToDTO(expenseRepository.save(expense));
    }

    @Override
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        expense.setDeleted(true);
        expenseRepository.save(expense);
    }
}