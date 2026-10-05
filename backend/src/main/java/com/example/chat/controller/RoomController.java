package com.example.chat.controller;

import com.example.chat.dto.CreateRoomRequest;
import com.example.chat.dto.MessageDTO;
import com.example.chat.model.ChatRoom;
import com.example.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final ChatService chatService;

    @Autowired
    public RoomController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<List<ChatRoom>> getAllRooms() {
        return ResponseEntity.ok(chatService.getAllRooms());
    }

    @PostMapping
    public ResponseEntity<ChatRoom> createRoom(@RequestBody CreateRoomRequest request) {
        return ResponseEntity.ok(chatService.createRoom(request));
    }

    @GetMapping("/{roomId}/history")
    public ResponseEntity<List<MessageDTO>> getRoomHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getRoomHistory(roomId));
    }
}
