package com.quickman.ordermanagement.controllers;

import com.quickman.ordermanagement.dtos.ReviewDTO;
import com.quickman.ordermanagement.services.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/today/totals")
    public ResponseEntity<ReviewDTO> getTodayTotals() {
        return ResponseEntity.ok(reviewService.getTodayTotals());
    }

    @GetMapping("/daily-totals")
    public ResponseEntity<List<ReviewDTO>> getDailyTotals() {
        return ResponseEntity.ok(reviewService.getDailyTotals());
    }

    @GetMapping("/grouped")
    public ResponseEntity<List<ReviewDTO>> getAllReviewsGroupedByDateAndUser() {
        return ResponseEntity.ok(reviewService.getAllReviewsGroupedByDateAndUser());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/by-date/{date}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime dateTime = localDate.atStartOfDay();
        return ResponseEntity.ok(reviewService.getReviewsByDate(dateTime));
    }

    @GetMapping("/by-user/{userId}/date/{date}")
    public ResponseEntity<ReviewDTO> getReviewByUserAndDate(
            @PathVariable Long userId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime dateTime = localDate.atStartOfDay();
        return ResponseEntity.ok(reviewService.getReviewByUserAndDate(userId, dateTime));
    }
    
}