package com.bitly.URL_Backend.repo;

import com.bitly.URL_Backend.model.ClickEvents;
import com.bitly.URL_Backend.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ClickEventRepo extends JpaRepository<ClickEvents, Long> {

    // 1. For fetching click events of a specific URL in a datetime range
    List<ClickEvents> findByUrlMappingAndClickedDateBetween(
            UrlMapping urlMapping,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    // 2. For fetching click events across multiple URLs in a date range (daily granularity)
    List<ClickEvents> findByUrlMappingInAndClickedDateBetween(
            List<UrlMapping> urlMappings,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}
