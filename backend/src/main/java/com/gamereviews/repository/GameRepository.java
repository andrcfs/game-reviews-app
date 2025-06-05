package com.gamereviews.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gamereviews.model.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByTitle(String title);

    List<Game> findByGenreIgnoreCase(String genre);

    List<Game> findByTitleContainingIgnoreCase(String title);
}
