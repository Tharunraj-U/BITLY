package com.bitly.URL_Backend.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ShortUrl {
    private String shortUrl;

    public String getShortUrl() {
        return shortUrl;
    }

    public ShortUrl setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
        return this;
    }

    public ShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }
}
