package com.bitly.URL_Backend.security.jwt;

import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

     @Autowired
     UserRepo userRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user=  userRepo.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Email Not exist"));

        return UserDetailsImpl.build(user);
    }
}
