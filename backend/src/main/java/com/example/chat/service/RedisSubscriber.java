package com.example.chat.service;

import com.example.chat.dto.MessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisSubscriber implements MessageListener {

    private static final Logger logger = LoggerFactory.getLogger(RedisSubscriber.class);

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public RedisSubscriber(ObjectMapper objectMapper, SimpMessagingTemplate messagingTemplate) {
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String body = new String(message.getBody());
            MessageDTO messageDTO = objectMapper.readValue(body, MessageDTO.class);
            logger.info("Redis subscriber received message for room {}: {}", messageDTO.getRoomId(), messageDTO.getContent());
            
            // Broadcast to STOMP topic for WebSocket clients
            messagingTemplate.convertAndSend("/topic/room/" + messageDTO.getRoomId(), messageDTO);
        } catch (Exception e) {
            logger.error("Error processing Redis message: {}", e.getMessage(), e);
        }
    }
}
