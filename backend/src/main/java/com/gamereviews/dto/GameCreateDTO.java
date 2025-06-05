
package com.gamereviews.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GameCreateDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    @Size(max = 50, message = "Genre must be less than 50 characters")
    private String genre;

    private Set<String> platforms;

    @Size(max = 500, message = "Image URL must be less than 500 characters")
    private String imageUrl;

    // Constructors
    public GameCreateDTO() {
    }

    public GameCreateDTO(String title, String description, String genre, Set<String> platforms, String imageUrl) {
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.platforms = platforms;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Set<String> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(Set<String> platforms) {
        this.platforms = platforms;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
