package com.ordergo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ordergo.models.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT COALESCE(SUM(e.expenseAmount), 0) FROM Expense e " +
           "WHERE e.isDeleted = false AND e.createdAt BETWEEN :start AND :end")
    Optional<BigDecimal> sumAllExpenses(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(e.expenseAmount), 0) FROM Expense e " +
           "WHERE e.isDeleted = false AND DATE(e.createdAt) = :date")
    Optional<BigDecimal> sumExpensesByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(e.expenseAmount), 0) FROM Expense e " +
           "WHERE e.isDeleted = false AND e.user.id = :userId " +
           "AND e.createdAt BETWEEN :start AND :end")
    Optional<BigDecimal> getTotalExpensesByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM expenses WHERE is_deleted = false",
           nativeQuery = true)
    Set<Date> findAllUniqueExpenseDates();

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM expenses " +
                   "WHERE user_id = :userId AND is_deleted = false", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM expenses " +
                   "WHERE CAST(created_at AS DATE) = :date AND is_deleted = false", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}