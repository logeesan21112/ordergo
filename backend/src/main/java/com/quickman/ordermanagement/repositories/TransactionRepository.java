package com.quickman.ordermanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.quickman.ordermanagement.models.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    @Query("SELECT COALESCE(SUM(t.deliveryCharge), 0) FROM Transaction t WHERE t.isDeleted = false AND t.createdAt BETWEEN :start AND :end")
    BigDecimal sumAllDeliveryCharge(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.cardOrOnlinePayment), 0) FROM Transaction t WHERE t.isDeleted = false AND t.createdAt BETWEEN :start AND :end")
    BigDecimal sumAllCardOrOnlinePayment(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT DISTINCT DATE(t.createdAt) FROM Transaction t WHERE t.isDeleted = false ORDER BY DATE(t.createdAt) DESC")
    List<Date> findDistinctTransactionDates();

    @Query("SELECT SUM(t.cardOrOnlinePayment) FROM Transaction t WHERE t.isDeleted = false AND DATE(t.createdAt) = :date")
    Optional<BigDecimal> sumCardOrOnlineByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(t.deliveryCharge) FROM Transaction t WHERE t.isDeleted = false AND DATE(t.createdAt) = :date")
    Optional<BigDecimal> sumDeliveryChargeByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.deliveryCharge), 0) FROM Transaction t " +
           "WHERE t.isDeleted = false AND t.user.id = :userId AND t.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalDeliveryChargeByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.cardOrOnlinePayment), 0) FROM Transaction t " +
           "WHERE t.isDeleted = false AND t.user.id = :userId AND t.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalCardOrOnlinePaymentByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM transaction WHERE is_deleted = false", nativeQuery = true)
    Set<Date> findAllUniqueTransactionDates();

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM transaction WHERE is_deleted = false AND user_id = :userId", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM transaction WHERE is_deleted = false AND CAST(created_at AS DATE) = :date", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}