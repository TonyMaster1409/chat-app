package com.example.chat.controller;

import com.example.chat.dto.UserDTO;
import com.example.chat.model.User;
import com.example.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final ChatService chatService;

    @Autowired
    public UserController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginOrRegister(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(chatService.registerOrUpdateUser(dto));
    }

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        return ResponseEntity.ok(chatService.getOnlineUsers());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam String username) {
        chatService.setUserOffline(username);
        return ResponseEntity.ok().build();
    }
}
