package com.bitly.URL_Backend.security.sign.service;


import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.repo.UserRepo;
import com.bitly.URL_Backend.security.jwt.JwtAuthResponce;
import com.bitly.URL_Backend.security.jwt.JwtUtils;
import com.bitly.URL_Backend.security.jwt.UserDetailsImpl;
import com.bitly.URL_Backend.security.sign.dto.LoginRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties;
import org.springframework.boot.autoconfigure.pulsar.PulsarProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;

    public boolean register(User user) {
        if(userRepo.existsByEmail(user.getEmail()))return false;
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return true;
    }


    public String authenticate(LoginRequest loginRequest) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));
        if (authentication == null) {
            throw new BadCredentialsException("Invalid email or password");
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails=(UserDetailsImpl) authentication.getPrincipal();
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTJAZ21haWwuY29tIiwicm9sZXMiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDcxNTIwNzYsImV4cCI6MTc0NzE1NTY3Nn0.PM23Eq_QkKHeiyH94BgbQD4Nvf7hfzPWg6cgF4HwbcI";
        boolean isValid = jwtUtils.validateToken(token);
        System.out.println(isValid ? "Valid JWT Token" : "Invalid JWT Token");

        return   jwtUtils.generateToken(userDetails);


    }
}
