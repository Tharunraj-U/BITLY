package com.bitly.URL_Backend.security.sign.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Data
@Getter
@Setter
public class RegisterRequest {
    private  String  username;
    private String email;
    private Set<String > roles;
    private String password;

    public String getEmail() {
        return email;
    }

    public RegisterRequest setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public RegisterRequest setPassword(String password) {
        this.password = password;
        return this;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public RegisterRequest setRoles(Set<String> roles) {
        this.roles = roles;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public RegisterRequest setUsername(String username) {
        this.username = username;
        return this;
    }
}
