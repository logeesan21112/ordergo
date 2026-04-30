package com.ordergo.services;

import java.time.LocalDateTime;
import java.util.List;
import com.ordergo.dtos.ReviewDTO;

public interface ReviewService {

    ReviewDTO getTodayTotals();
    List<ReviewDTO> getDailyTotals();
    List<ReviewDTO> getAllReviewsGroupedByDateAndUser();
    List<ReviewDTO> getReviewsByUser(Long userId);
    List<ReviewDTO> getReviewsByDate(LocalDateTime date);
    ReviewDTO getReviewByUserAndDate(Long userId, LocalDateTime date);
}