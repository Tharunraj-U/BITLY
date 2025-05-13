package com.bitly.URL_Backend.service;

import com.bitly.URL_Backend.dto.ClickEventDTO;
import com.bitly.URL_Backend.dto.ShortUrl;
import com.bitly.URL_Backend.dto.UrlDto;
import com.bitly.URL_Backend.model.ClickEvents;
import com.bitly.URL_Backend.model.UrlMapping;
import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.repo.ClickEventRepo;
import com.bitly.URL_Backend.repo.UrlMappingRepo;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import org.hibernate.grammars.hql.HqlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UrlMappingService {

    @Autowired
    private UrlMappingRepo urlMappingRepo;

    @Autowired
    private ClickEventRepo clickEventRepo;

    public ShortUrl convertToShortUrl(UrlDto urlDTO, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setCreatedDate(LocalDateTime.now());
        urlMapping.setOriginalUrl(urlDTO.getOriginalUrl());
        urlMapping.setUser(user);

        urlMappingRepo.save(urlMapping);
        return new ShortUrl(shortUrl);
    }

    public String generateShortUrl() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }

    public List<UrlMapping> getAllMapping(User user) {
        return urlMappingRepo.findAllByUserId(user.getId());
    }

    public List<ClickEventDTO> getClickEventByDate(String shortUrl, LocalDateTime startDate, LocalDateTime endDate) {
        UrlMapping urlMapping = urlMappingRepo.findByShortUrl(shortUrl);
        if (urlMapping == null) return Collections.emptyList();

        return clickEventRepo.findByUrlMappingAndClickedDateBetween(urlMapping, startDate, endDate)
                .stream()
                .collect(Collectors.groupingBy(click -> click.getClickedDate().toLocalDate(), Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> new ClickEventDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public Map<LocalDate, Long> getClickEventByDateForTheUser(User user, LocalDate start, LocalDate end) {
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.plusDays(1).atStartOfDay(); // exclusive upper bound

        return clickEventRepo.findByUrlMappingInAndClickedDateBetween(getAllMapping(user), startDateTime, endDateTime)
                .stream()
                .collect(Collectors.groupingBy(click -> click.getClickedDate().toLocalDate(), Collectors.counting()));
    }

    public UrlMapping getOriginalUrl(String sortUrl) {
        UrlMapping urlMapping=urlMappingRepo.findByShortUrl(sortUrl);;
        if(urlMapping != null){
             urlMapping.setClickCount(urlMapping.getClickCount()+1);
             urlMappingRepo.save(urlMapping);
            ClickEvents clickEvents=new ClickEvents();
            clickEvents.setClickedDate(LocalDateTime.now());
            clickEvents.setUrlMapping(urlMapping);
            clickEventRepo.save(clickEvents);
        }
        return urlMapping;
    }
}
