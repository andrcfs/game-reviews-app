package com.gamereviews.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamereviews.dto.ReviewRequest;
import com.gamereviews.dto.ReviewResponse;
import com.gamereviews.service.JwtUtil;
import com.gamereviews.service.ReviewService;
import com.gamereviews.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByGameId(@PathVariable Long gameId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByGameId(gameId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUserId(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/game/{gameId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByGameId(@PathVariable Long gameId) {
        Double averageRating = reviewService.getAverageRatingByGameId(gameId);
        return ResponseEntity.ok(averageRating);
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("User-ID") String userIdentifier) {
        Long userId = getUserIdFromIdentifier(userIdentifier);
        ReviewResponse createdReview = reviewService.createReview(reviewRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("User-ID") String userIdentifier) {
        Long userId = getUserIdFromIdentifier(userIdentifier);
        ReviewResponse updatedReview = reviewService.updateReview(id, reviewRequest, userId);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @RequestHeader("User-ID") String userIdentifier) {
        Long userId = getUserIdFromIdentifier(userIdentifier);
        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromIdentifier(String userIdentifier) {
        try {
            // Try to parse as Long first (if it's already a user ID)
            return Long.parseLong(userIdentifier);
        } catch (NumberFormatException e) {
            // If it's not a number, assume it's an email and look up the user
            return userService.findByEmail(userIdentifier).getId();
        }
    }
}
