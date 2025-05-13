package com.bitly.URL_Backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlDto {
    private  Long id;
    private String originalUrl;
    private String shortUrl;
    private int clickCount;
    private LocalDateTime createdDate;

    public int getClickCount() {
        return clickCount;
    }

    public UrlDto setClickCount(int clickCount) {
        this.clickCount = clickCount;
        return this;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public UrlDto setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public Long getId() {
        return id;
    }

    public UrlDto setId(Long id) {
        this.id = id;
        return this;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public UrlDto setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
        return this;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public UrlDto setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
        return this;
    }
}
