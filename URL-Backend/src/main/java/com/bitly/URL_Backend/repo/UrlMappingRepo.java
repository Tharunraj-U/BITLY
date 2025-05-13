package com.bitly.URL_Backend.repo;

import com.bitly.URL_Backend.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UrlMappingRepo  extends JpaRepository<UrlMapping,Long> {
    List<UrlMapping> findAllByUserId(Long id);

    UrlMapping findByShortUrl(String shortUrl);


}
