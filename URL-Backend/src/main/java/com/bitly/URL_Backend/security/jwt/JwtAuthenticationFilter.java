package com.bitly.URL_Backend.security.jwt;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;


    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
             String url=request.getServletPath();
            if (url.startsWith("/api/auth")) {
                System.out.println("\\n,\\n+"+url+"\\n,\\n \\n\\n");
                filterChain.doFilter(request, response);
                return;
            }

            String jwt=jwtUtils.getJwtFromHeader(request);

            if(jwt != null && jwtUtils.validateToken(jwt)){
                String email=jwtUtils.getUserNameFromToken(jwt);
                UserDetails userDetails=userDetailsService.loadUserByUsername(email);
                if(userDetails != null){
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(userDetails,null);
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }

            }
        }catch( Exception e){
               e.printStackTrace();
        }
        filterChain.doFilter(request,response);
    }
}
