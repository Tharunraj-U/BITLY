package com.bitly.URL_Backend.security.sign.Contoller;


import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.security.sign.dto.LoginRequest;
import com.bitly.URL_Backend.security.sign.dto.RegisterRequest;
import com.bitly.URL_Backend.security.sign.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {



     @Autowired
     private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        User user=new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setUsername(registerRequest.getUsername());
        user.setRole("ROLE_USER");
        if(userService.register(user)){
            return ResponseEntity.ok(user+" User Registered Successfully");
        }
        return  ResponseEntity.ok(user+" User Cannot register");
    }
    @PostMapping("/login")
    public ResponseEntity<?> SignInUser(@Valid @RequestBody LoginRequest loginRequest){
       return ResponseEntity.ok(userService.authenticate(loginRequest));
    }

}
