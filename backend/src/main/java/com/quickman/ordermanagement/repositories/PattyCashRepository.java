package com.quickman.ordermanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.quickman.ordermanagement.models.PattyCash;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface PattyCashRepository extends JpaRepository<PattyCash, Long> {
    @Query("SELECT COALESCE(SUM(p.pattyCash), 0) FROM PattyCash p WHERE p.date BETWEEN :start AND :end")
    Optional<BigDecimal> sumAllPattyCash(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.pattyCash), 0) FROM PattyCash p WHERE DATE(p.date) = :date")
    Optional<BigDecimal> sumPattyCashByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(p.pattyCash), 0) FROM PattyCash p " +
           "WHERE p.userId = :userId AND p.date BETWEEN :start AND :end")
    Optional<BigDecimal> getPattyCashByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(date AS DATE) FROM patty_cash", nativeQuery = true)
    Set<Date> findAllUniquePattyCashDates();

    @Query(value = "SELECT DISTINCT CAST(date AS DATE) FROM patty_cash WHERE user_id = :userId", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM patty_cash WHERE CAST(date AS DATE) = :date", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}