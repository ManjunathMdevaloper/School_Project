package com.softgv.management.service.impl;

import com.softgv.management.entity.User;
import com.softgv.management.repository.UserRepository;
import com.softgv.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        // In a real app, encode password here
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User validateUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real app, use BCrypt check
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}
