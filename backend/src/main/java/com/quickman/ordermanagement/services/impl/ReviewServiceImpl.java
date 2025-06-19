package com.quickman.ordermanagement.services.impl;

import com.quickman.ordermanagement.dtos.ReviewDTO;
import com.quickman.ordermanagement.models.User;
import com.quickman.ordermanagement.repositories.*;
import com.quickman.ordermanagement.services.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final TransactionRepository transactionRepository;
    private final PattyCashRepository pattyCashRepository;
    private final ChargeRepository chargeRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewDTO getTodayTotals() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.toLocalDate().atStartOfDay();
        LocalDateTime end = now.toLocalDate().atTime(LocalTime.MAX);

        BigDecimal deliveryCharge = transactionRepository.sumAllDeliveryCharge(start, end);
        BigDecimal cardOnline = transactionRepository.sumAllCardOrOnlinePayment(start, end);
        BigDecimal pattyCash = pattyCashRepository.sumAllPattyCash(start, end).orElse(BigDecimal.ZERO);
        BigDecimal expenses = chargeRepository.sumAllExpenses(start, end).orElse(BigDecimal.ZERO);
        BigDecimal balance = deliveryCharge.subtract(cardOnline).add(pattyCash).subtract(expenses);

        return new ReviewDTO(null, "ALL_USERS", now, deliveryCharge, cardOnline, pattyCash, expenses, balance);
    }

    @Override
    public List<ReviewDTO> getDailyTotals() {
        Set<LocalDate> dates = new HashSet<>();
        dates.addAll(transactionRepository.findAllUniqueTransactionDates()
            .stream()
            .map(this::convertToLocalDate)
            .collect(Collectors.toSet()));

        List<ReviewDTO> reviews = new ArrayList<>();
        for (LocalDate date : dates) {
            BigDecimal deliveryCharge = transactionRepository.sumDeliveryChargeByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal cardOnline = transactionRepository.sumCardOrOnlineByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal pattyCash = pattyCashRepository.sumPattyCashByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal expenses = chargeRepository.sumExpensesByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal balance = deliveryCharge.add(cardOnline).subtract(pattyCash).subtract(expenses);

            reviews.add(new ReviewDTO(null, "ALL_USERS", date.atStartOfDay(), 
                deliveryCharge, cardOnline, pattyCash, expenses, balance));
        }
        return reviews;
    }

    @Override
    public List<ReviewDTO> getAllReviewsGroupedByDateAndUser() {
        List<User> users = userRepository.findAll();
        Set<LocalDate> allDates = getAllUniqueDatesFromAllSources();
        
        return users.stream()
            .flatMap(user -> allDates.stream()
                .map(date -> buildReviewDTO(user.getId(), user.getName(), date.atStartOfDay()))
            .filter(Objects::nonNull))
            .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        String userName = userRepository.findById(userId)
            .map(User::getName)
            .orElse("Unknown");
        
        return getAllUniqueDatesForUser(userId).stream()
            .map(date -> buildReviewDTO(userId, userName, date.atStartOfDay()))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByDate(LocalDateTime dateTime) {
        LocalDate date = dateTime.toLocalDate();
        return getAllUserIdsWithActivityOnDate(date).stream()
            .map(userId -> buildReviewDTO(userId, 
                userRepository.findById(userId).map(User::getName).orElse("Unknown"), 
                date.atStartOfDay()))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO getReviewByUserAndDate(Long userId, LocalDateTime dateTime) {
        return buildReviewDTO(userId, 
            userRepository.findById(userId).map(User::getName).orElse("Unknown"), 
            dateTime);
    }

    private ReviewDTO buildReviewDTO(Long userId, String userName, LocalDateTime dateTime) {
        LocalDate date = dateTime.toLocalDate();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        BigDecimal delivery = transactionRepository.getTotalDeliveryChargeByUserIdAndDateRange(userId, start, end);
        BigDecimal cardPayment = transactionRepository.getTotalCardOrOnlinePaymentByUserIdAndDateRange(userId, start, end);
        BigDecimal pattyCash = pattyCashRepository.getPattyCashByUserIdAndDateRange(userId, start, end).orElse(BigDecimal.ZERO);
        BigDecimal expenses = chargeRepository.getTotalExpensesByUserIdAndDateRange(userId, start, end).orElse(BigDecimal.ZERO);
        BigDecimal balance = delivery.subtract(cardPayment).add(pattyCash).subtract(expenses);

        if (delivery.compareTo(BigDecimal.ZERO) == 0 && cardPayment.compareTo(BigDecimal.ZERO) == 0 &&
            pattyCash.compareTo(BigDecimal.ZERO) == 0 && expenses.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }

        return new ReviewDTO(userId, userName, start, delivery, cardPayment, pattyCash, expenses, balance);
    }

    private Set<LocalDate> getAllUniqueDatesFromAllSources() {
        Set<LocalDate> dates = new HashSet<>();
        dates.addAll(convertDates(transactionRepository.findAllUniqueTransactionDates()));
        dates.addAll(convertDates(chargeRepository.findAllUniqueChargeDates()));
        dates.addAll(convertDates(pattyCashRepository.findAllUniquePattyCashDates()));
        return dates;
    }

    private Set<LocalDate> convertDates(Set<Date> dates) {
        return dates.stream().map(this::convertToLocalDate).collect(Collectors.toSet());
    }

    private LocalDate convertToLocalDate(Date date) {
        return date instanceof java.sql.Date ? 
            ((java.sql.Date) date).toLocalDate() : 
            date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private Set<LocalDate> getAllUniqueDatesForUser(Long userId) {
        Set<LocalDate> dates = new HashSet<>();
        addDates(dates, transactionRepository.findDatesByUserId(userId));
        addDates(dates, chargeRepository.findDatesByUserId(userId));
        addDates(dates, pattyCashRepository.findDatesByUserId(userId));
        return dates;
    }

    private void addDates(Set<LocalDate> target, Set<Date> source) {
        source.forEach(date -> target.add(convertToLocalDate(date)));
    }

    private Set<Long> getAllUserIdsWithActivityOnDate(LocalDate date) {
        Set<Long> userIds = new HashSet<>();
        userIds.addAll(transactionRepository.findUserIdsByDate(date));
        userIds.addAll(chargeRepository.findUserIdsByDate(date));
        userIds.addAll(pattyCashRepository.findUserIdsByDate(date));
        return userIds;
    }
}