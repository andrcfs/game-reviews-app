package com.gamereviews.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamereviews.dto.ReviewRequest;
import com.gamereviews.dto.ReviewResponse;
import com.gamereviews.exception.DuplicateReviewException;
import com.gamereviews.exception.ResourceNotFoundException;
import com.gamereviews.model.Game;
import com.gamereviews.model.Review;
import com.gamereviews.model.User;
import com.gamereviews.repository.GameRepository;
import com.gamereviews.repository.ReviewRepository;
import com.gamereviews.repository.UserRepository;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        return new ReviewResponse(review);
    }

    public List<ReviewResponse> getReviewsByGameId(Long gameId) {
        if (!gameRepository.existsById(gameId)) {
            throw new ResourceNotFoundException("Game not found with id: " + gameId);
        }
        return reviewRepository.findByGameId(gameId).stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByGameId(Long gameId) {
        if (!gameRepository.existsById(gameId)) {
            throw new ResourceNotFoundException("Game not found with id: " + gameId);
        }
        Double average = reviewRepository.findAverageRatingByGameId(gameId);
        return average != null ? average : 0.0;
    }

    public ReviewResponse createReview(ReviewRequest reviewRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Game game = gameRepository.findById(reviewRequest.getGameId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Game not found with id: " + reviewRequest.getGameId()));

        // Check if user already reviewed this game
        List<Review> existingReviews = reviewRepository.findByGameId(reviewRequest.getGameId());
        boolean hasReviewed = existingReviews.stream()
                .anyMatch(review -> review.getUser().getId().equals(userId));

        if (hasReviewed) {
            throw new DuplicateReviewException("User has already reviewed this game");
        }

        Review review = new Review(reviewRequest.getRating(), reviewRequest.getComment(), user, game);
        Review savedReview = reviewRepository.save(review);
        return new ReviewResponse(savedReview);
    }

    public ReviewResponse updateReview(Long id, ReviewRequest reviewRequest, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        if (!review.getUser().getId().equals(userId)) {
            throw new SecurityException("User can only update their own reviews");
        }

        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        Review savedReview = reviewRepository.save(review);
        return new ReviewResponse(savedReview);
    }

    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        if (!review.getUser().getId().equals(userId)) {
            throw new SecurityException("User can only delete their own reviews");
        }

        reviewRepository.delete(review);
    }
}
