package com.example.chat.controller;

import com.example.chat.dto.MessageDTO;
import com.example.chat.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @Payload MessageDTO message) {
        message.setRoomId(roomId);
        logger.info("Received STOMP message for room {}: {}", roomId, message.getContent());
        chatService.processAndSaveMessage(message);
    }

    @MessageMapping("/chat.addUser/{roomId}")
    public void addUser(@DestinationVariable String roomId,
                        @Payload MessageDTO message,
                        SimpMessageHeaderAccessor headerAccessor) {
        // Store username and roomId in WebSocket session attributes
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("username", message.getSender());
            headerAccessor.getSessionAttributes().put("roomId", roomId);
        }
        
        message.setRoomId(roomId);
        logger.info("User {} joined room {}", message.getSender(), roomId);
        chatService.processAndSaveMessage(message);
    }

    @MessageMapping("/chat.typing/{roomId}")
    public void userTyping(@DestinationVariable String roomId, @Payload MessageDTO message) {
        message.setRoomId(roomId);
        chatService.processAndSaveMessage(message);
    }
}
