package com.softgv.management.service;

import com.softgv.management.entity.User;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);

    Optional<User> findByUsername(String username);

    User validateUser(String username, String password); // Simple validation
}
