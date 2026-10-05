package com.example.chat.service;

import com.example.chat.dto.MessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisPublisher {

    private static final Logger logger = LoggerFactory.getLogger(RedisPublisher.class);

    @Value("${app.redis.enabled:false}")
    private boolean redisEnabled;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public RedisPublisher(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate,
                          ChannelTopic topic,
                          SimpMessagingTemplate messagingTemplate) {
        this.redisTemplate = redisTemplate;
        this.topic = topic;
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(MessageDTO message) {
        if (redisEnabled && redisTemplate != null) {
            try {
                logger.info("Publishing message to Redis channel {}", topic.getTopic());
                redisTemplate.convertAndSend(topic.getTopic(), message);
                return;
            } catch (Exception e) {
                logger.warn("Failed to publish to Redis, falling back to direct STOMP send: {}", e.getMessage());
            }
        }
        
        // Direct STOMP fallback if Redis is disabled or fails
        logger.info("Directly sending STOMP message to /topic/room/{}", message.getRoomId());
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomId(), message);
    }
}
