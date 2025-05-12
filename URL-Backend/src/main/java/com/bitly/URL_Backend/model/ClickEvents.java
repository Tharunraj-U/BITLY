package com.bitly.URL_Backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ClickEvents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickedDate;


    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlMapping;

    public LocalDateTime getClickedDate() {
        return clickedDate;
    }

    public ClickEvents setClickedDate(LocalDateTime clickedDate) {
        this.clickedDate = clickedDate;
        return this;
    }

    public Long getId() {
        return id;
    }

    public ClickEvents setId(Long id) {
        this.id = id;
        return this;
    }

    public UrlMapping getUrlMapping() {
        return urlMapping;
    }

    public ClickEvents setUrlMapping(UrlMapping urlMapping) {
        this.urlMapping = urlMapping;
        return this;
    }
}
