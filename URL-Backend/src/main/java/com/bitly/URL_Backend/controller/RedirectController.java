package com.bitly.URL_Backend.controller;


import com.bitly.URL_Backend.model.UrlMapping;
import com.bitly.URL_Backend.repo.UrlMappingRepo;
import com.bitly.URL_Backend.service.UrlMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedirectController {


    @Autowired
    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> reDirect(@PathVariable("shortUrl") String sortUrl) {
        UrlMapping urlMapping= urlMappingService.getOriginalUrl(sortUrl);
        if(urlMapping != null){
            HttpHeaders httpHeaders= new HttpHeaders();
            httpHeaders.add("Location",urlMapping.getOriginalUrl());


            return ResponseEntity.status(302).headers(httpHeaders).build();
        }return ResponseEntity.notFound().build();
    }

}
