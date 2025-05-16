package com.bitly.URL_Backend.controller;


import com.bitly.URL_Backend.dto.ClickEventDTO;
import com.bitly.URL_Backend.dto.ShortUrl;
import com.bitly.URL_Backend.dto.UrlDto;
import com.bitly.URL_Backend.model.UrlMapping;
import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.repo.UserRepo;
import com.bitly.URL_Backend.service.UrlMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/url")

public class UrlMappingController {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UrlMappingService urlMappingService;


    @PostMapping("/shortUrl")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> mapUrl(@RequestBody UrlDto urlDTO, Principal principal) {
        Optional<User> user = userRepo.findByEmail(principal.getName());
        ShortUrl urlDto = urlMappingService.convertToShortUrl(urlDTO, user.get());
        return ResponseEntity.ok(urlDto);
    }


    @GetMapping("/getAll")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMapping>> getAllMapping(Principal principal){
        Optional<User> user = userRepo.findByEmail(principal.getName());
        return ResponseEntity.ok(urlMappingService.getAllMapping(user.get()));
    }

    @GetMapping("/UrlSpecific/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getAllUrl(@PathVariable String shortUrl, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate){
        DateTimeFormatter dateTimeFormatter=DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start=LocalDateTime.parse(startDate,dateTimeFormatter);
        LocalDateTime end=LocalDateTime.parse(endDate,dateTimeFormatter);
        List<ClickEventDTO> clickEvent=urlMappingService.getClickEventByDate(shortUrl,start,end);
        return  ResponseEntity.ok(clickEvent);
    }
    @GetMapping("/totalClickAnalytics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate,Long> > getAllUrl( @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, Principal principal){
        DateTimeFormatter dateTimeFormatter=DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate start= LocalDate.parse(startDate,dateTimeFormatter);
        LocalDate end=LocalDate.parse(endDate,dateTimeFormatter);
        Optional<User> user=userRepo.findByEmail(principal.getName());
        Map<LocalDate,Long> clickEvent=urlMappingService.getClickEventByDateForTheUser(user.get(),start,end);
        return  ResponseEntity.ok(clickEvent);
    }
}

