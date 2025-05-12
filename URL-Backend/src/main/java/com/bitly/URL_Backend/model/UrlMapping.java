package com.bitly.URL_Backend.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class UrlMapping {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String originalUrl;
    private String shortUrl;
    private int clickCount=0;
    private LocalDateTime createdDate;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "urlMapping")
    private List<ClickEvents> clickEvents;


    public int getClickCount() {
        return clickCount;
    }

    public UrlMapping setClickCount(int clickCount) {
        this.clickCount = clickCount;
        return this;
    }

    public List<ClickEvents> getClickEvents() {
        return clickEvents;
    }

    public UrlMapping setClickEvents(List<ClickEvents> clickEvents) {
        this.clickEvents = clickEvents;
        return this;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public UrlMapping setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public Long getId() {
        return id;
    }

    public UrlMapping setId(Long id) {
        this.id = id;
        return this;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public UrlMapping setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
        return this;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public UrlMapping setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
        return this;
    }

    public User getUser() {
        return user;
    }

    public UrlMapping setUser(User user) {
        this.user = user;
        return this;
    }
}
