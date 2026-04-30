package com.ordergo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ordergo.models.Delivery;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface DeliveryRepository extends JpaRepository<Delivery, Long>, JpaSpecificationExecutor<Delivery> {

    @Query("SELECT COALESCE(SUM(d.deliveryCharge), 0) FROM Delivery d " +
           "WHERE d.isDeleted = false AND d.createdAt BETWEEN :start AND :end")
    BigDecimal sumAllDeliveryCharge(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(d.cardOrOnlinePayment), 0) FROM Delivery d " +
           "WHERE d.isDeleted = false AND d.createdAt BETWEEN :start AND :end")
    BigDecimal sumAllCardOrOnlinePayment(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT DISTINCT DATE(d.createdAt) FROM Delivery d " +
           "WHERE d.isDeleted = false ORDER BY DATE(d.createdAt) DESC")
    List<Date> findDistinctDeliveryDates();

    @Query("SELECT SUM(d.cardOrOnlinePayment) FROM Delivery d " +
           "WHERE d.isDeleted = false AND DATE(d.createdAt) = :date")
    Optional<BigDecimal> sumCardOrOnlineByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(d.deliveryCharge) FROM Delivery d " +
           "WHERE d.isDeleted = false AND DATE(d.createdAt) = :date")
    Optional<BigDecimal> sumDeliveryChargeByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(d.deliveryCharge), 0) FROM Delivery d " +
           "WHERE d.isDeleted = false AND d.user.id = :userId " +
           "AND d.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalDeliveryChargeByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(d.cardOrOnlinePayment), 0) FROM Delivery d " +
           "WHERE d.isDeleted = false AND d.user.id = :userId " +
           "AND d.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalCardOrOnlinePaymentByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM deliveries " +
                   "WHERE is_deleted = false", nativeQuery = true)
    Set<Date> findAllUniqueDeliveryDates();

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM deliveries " +
                   "WHERE is_deleted = false AND user_id = :userId", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM deliveries " +
                   "WHERE is_deleted = false AND CAST(created_at AS DATE) = :date", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}