package com.bitly.URL_Backend.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;


@Component
public class JwtUtils {
   private  final  String secret = "Km9Vc8UzL3Rnbk5vcEd1cGpQaXZ4V29VdDVmQ1lxaDA=";

    public String getJwtFromHeader(HttpServletRequest request){
        String token=request.getHeader("Authorization");
        if(token != null && token.startsWith("Bearer ")){
            return  token.substring(7);
        }
        return null;
    }

    public  String generateToken(UserDetailsImpl userDetails){
        String email=userDetails.getEmail();
        String roles=userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect( Collectors.joining(","));
        return Jwts.builder()
                .subject(email)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key())
                .compact();

    }
    private Key key(){

        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String  getUserNameFromToken(String token){
        return Jwts.parser().
                verifyWith((SecretKey) key()).
                build().
                parseSignedClaims(token).
                getPayload().getSubject();
    }

    public  boolean validateToken(String token){
        try {
            Jwts.parser().verifyWith((SecretKey) key()).build()
                    .parseSignedClaims(token);
        }catch (Exception e){
            throw  new RuntimeException(e);
        }

        return true;
    }



}
