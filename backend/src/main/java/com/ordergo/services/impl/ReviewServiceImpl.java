package com.ordergo.services.impl;

import com.ordergo.dtos.ReviewDTO;
import com.ordergo.models.User;
import com.ordergo.repositories.*;
import com.ordergo.services.ReviewService;
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

    private final DeliveryRepository deliveryRepository;
    private final PettyCashRepository pettyCashRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewDTO getTodayTotals() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.toLocalDate().atStartOfDay();
        LocalDateTime end = now.toLocalDate().atTime(LocalTime.MAX);

        BigDecimal deliveryCharge = deliveryRepository.sumAllDeliveryCharge(start, end);
        BigDecimal cardOnline = deliveryRepository.sumAllCardOrOnlinePayment(start, end);
        BigDecimal pettyCash = pettyCashRepository.sumAllPettyCash(start, end).orElse(BigDecimal.ZERO);
        BigDecimal expenses = expenseRepository.sumAllExpenses(start, end).orElse(BigDecimal.ZERO);
        BigDecimal balance = deliveryCharge.subtract(cardOnline).add(pettyCash).subtract(expenses);

        return new ReviewDTO(null, "ALL_USERS", null, now, deliveryCharge, cardOnline, pettyCash, expenses, balance);
    }

    @Override
    public List<ReviewDTO> getDailyTotals() {
        Set<LocalDate> dates = new HashSet<>();
        dates.addAll(deliveryRepository.findAllUniqueDeliveryDates()
                .stream()
                .map(this::convertToLocalDate)
                .collect(Collectors.toSet()));

        List<ReviewDTO> reviews = new ArrayList<>();
        for (LocalDate date : dates) {
            BigDecimal deliveryCharge = deliveryRepository.sumDeliveryChargeByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal cardOnline = deliveryRepository.sumCardOrOnlineByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal pettyCash = pettyCashRepository.sumPettyCashByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal expenses = expenseRepository.sumExpensesByDate(date).orElse(BigDecimal.ZERO);
            BigDecimal balance = deliveryCharge.add(cardOnline).subtract(pettyCash).subtract(expenses);

            reviews.add(new ReviewDTO(null, "ALL_USERS", null, date.atStartOfDay(),
                    deliveryCharge, cardOnline, pettyCash, expenses, balance));
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

        User user = userRepository.findById(userId).orElse(null);

        LocalDate date = dateTime.toLocalDate();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        BigDecimal deliveryCharge = deliveryRepository.getTotalDeliveryChargeByUserIdAndDateRange(userId, start, end);
        BigDecimal cardOnline = deliveryRepository.getTotalCardOrOnlinePaymentByUserIdAndDateRange(userId, start, end);
        BigDecimal pettyCash = pettyCashRepository.getPettyCashByUserIdAndDateRange(userId, start, end)
                .orElse(BigDecimal.ZERO);
        BigDecimal expenses = expenseRepository.getTotalExpensesByUserIdAndDateRange(userId, start, end)
                .orElse(BigDecimal.ZERO);

        BigDecimal balance = deliveryCharge.subtract(cardOnline)
                .add(pettyCash)
                .subtract(expenses);

        if (deliveryCharge.compareTo(BigDecimal.ZERO) == 0 &&
            cardOnline.compareTo(BigDecimal.ZERO) == 0 &&
            pettyCash.compareTo(BigDecimal.ZERO) == 0 &&
            expenses.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }

        return new ReviewDTO(
                userId,
                userName,
                user != null ? user.getImageUrl() : null,
                start,
                deliveryCharge,
                cardOnline,
                pettyCash,
                expenses,
                balance
        );
    }


    private Set<LocalDate> getAllUniqueDatesFromAllSources() {
        Set<LocalDate> dates = new HashSet<>();
        dates.addAll(convertDates(deliveryRepository.findAllUniqueDeliveryDates()));
        dates.addAll(convertDates(expenseRepository.findAllUniqueExpenseDates()));
        dates.addAll(convertDates(pettyCashRepository.findAllUniquePettyCashDates()));
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
        addDates(dates, deliveryRepository.findDatesByUserId(userId));
        addDates(dates, expenseRepository.findDatesByUserId(userId));
        addDates(dates, pettyCashRepository.findDatesByUserId(userId));
        return dates;
    }

    private void addDates(Set<LocalDate> target, Set<Date> source) {
        source.forEach(date -> target.add(convertToLocalDate(date)));
    }

    private Set<Long> getAllUserIdsWithActivityOnDate(LocalDate date) {
        Set<Long> userIds = new HashSet<>();
        userIds.addAll(deliveryRepository.findUserIdsByDate(date));
        userIds.addAll(expenseRepository.findUserIdsByDate(date));
        userIds.addAll(pettyCashRepository.findUserIdsByDate(date));
        return userIds;
    }
}