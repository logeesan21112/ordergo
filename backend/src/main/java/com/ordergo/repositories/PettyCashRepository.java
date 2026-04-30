package com.ordergo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ordergo.models.PettyCash;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface PettyCashRepository extends JpaRepository<PettyCash, Long> {

    @Query("SELECT COALESCE(SUM(p.pettyCash), 0) FROM PettyCash p " +
           "WHERE p.createdAt BETWEEN :start AND :end")
    Optional<BigDecimal> sumAllPettyCash(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.pettyCash), 0) FROM PettyCash p " +
           "WHERE DATE(p.createdAt) = :date")
    Optional<BigDecimal> sumPettyCashByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(p.pettyCash), 0) FROM PettyCash p " +
           "WHERE p.userId = :userId AND p.createdAt BETWEEN :start AND :end")
    Optional<BigDecimal> getPettyCashByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM petty_cash", nativeQuery = true)
    Set<Date> findAllUniquePettyCashDates();

    @Query(value = "SELECT DISTINCT CAST(created_at AS DATE) FROM petty_cash " +
                   "WHERE user_id = :userId", nativeQuery = true)
    Set<Date> findDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT user_id FROM petty_cash " +
                   "WHERE CAST(created_at AS DATE) = :date", nativeQuery = true)
    Set<Long> findUserIdsByDate(@Param("date") LocalDate date);
}