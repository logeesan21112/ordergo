package com.quickman.ordermanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.quickman.ordermanagement.models.Charge;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface ChargeRepository extends JpaRepository<Charge, Long> {
    @Query("SELECT COALESCE(SUM(c.expenseAmount), 0) FROM Charge c " +
           "WHERE c.isDeleted = false AND c.date BETWEEN :start AND :end")
    Optional<BigDecimal> sumAllExpenses(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(c.expenseAmount), 0) FROM Charge c " +
           "WHERE c.isDeleted = false AND DATE(c.date) = :date")
    Optional<BigDecimal> sumExpensesByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(c.expenseAmount), 0) FROM Charge c " +
           "WHERE c.isDeleted = false AND c.user.id = :userId " +
           "AND c.date BETWEEN :start AND :end")
    Optional<BigDecimal> getTotalExpensesByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(date AS DATE) FROM charge WHERE is_deleted = false",
           nativeQuery = true)
    Set<Date> findAllUniqueChargeDates();

    @Query(value = "SELECT DISTINCT CAST(date AS DATE) FROM charge " +
                   "WHERE user_id = :userId AND is_deleted = false", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM charge " +
                   "WHERE CAST(date AS DATE) = :date AND is_deleted = false", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}