package com.ordergo.controllers;

import com.ordergo.dtos.ExpenseDTO;
import com.ordergo.dtos.ExpenseRequest;
import com.ordergo.services.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/add")
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id,
                                                     @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}