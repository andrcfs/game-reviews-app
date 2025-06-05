package com.gamereviews.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamereviews.dto.GameCreateDTO;
import com.gamereviews.dto.GameResponseDTO;
import com.gamereviews.model.Game; // Assuming Game entity exists
import com.gamereviews.repository.GameRepository; // Assuming GameRepository exists

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public List<GameResponseDTO> getAllGames() {
        return gameRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<GameResponseDTO> getGameById(Long id) {
        return gameRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public GameResponseDTO createGame(GameCreateDTO gameCreateDTO) {
        // Validate required fields
        if (gameCreateDTO.getTitle() == null || gameCreateDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Game title is required");
        }

        // Check for duplicate title
        Optional<Game> existingGame = gameRepository.findByTitle(gameCreateDTO.getTitle().trim());
        if (existingGame.isPresent()) {
            throw new IllegalArgumentException("A game with this title already exists");
        }

        try {
            Game game = convertToEntity(gameCreateDTO);
            game.setTitle(game.getTitle().trim());
            game.setCreatedAt(LocalDateTime.now());

            Game savedGame = gameRepository.save(game);
            return convertToDto(savedGame);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create game: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<GameResponseDTO> searchGamesByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return getAllGames();
        }
        return gameRepository.findByTitleContainingIgnoreCase(title.trim()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GameResponseDTO> getGamesByGenre(String genre) {
        if (genre == null || genre.trim().isEmpty()) {
            return getAllGames();
        }
        return gameRepository.findByGenreIgnoreCase(genre.trim()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private GameResponseDTO convertToDto(Game game) {
        GameResponseDTO gameResponseDTO = new GameResponseDTO();
        gameResponseDTO.setId(game.getId());
        gameResponseDTO.setTitle(game.getTitle());
        gameResponseDTO.setDescription(game.getDescription());
        gameResponseDTO.setGenre(game.getGenre());
        gameResponseDTO.setPlatforms(game.getPlatforms());
        gameResponseDTO.setImageUrl(game.getImageUrl());
        gameResponseDTO.setCreatedAt(game.getCreatedAt());
        gameResponseDTO.setReviewCount(game.getReviews() != null ? game.getReviews().size() : 0);

        double averageRating = 0.0;
        if (game.getReviews() != null && !game.getReviews().isEmpty()) {
            averageRating = game.getReviews().stream()
                    .mapToInt(review -> review.getRating())
                    .average()
                    .orElse(0.0);
        }
        gameResponseDTO.setAverageRating(averageRating);

        return gameResponseDTO;
    }

    private Game convertToEntity(GameCreateDTO gameCreateDTO) {
        Game game = new Game();
        game.setTitle(gameCreateDTO.getTitle());
        game.setDescription(gameCreateDTO.getDescription());
        game.setGenre(gameCreateDTO.getGenre());
        game.setPlatforms(gameCreateDTO.getPlatforms());
        game.setImageUrl(gameCreateDTO.getImageUrl());
        return game;
    }
}
