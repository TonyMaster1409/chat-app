package com.example.chat.service;

import com.example.chat.dto.CreateRoomRequest;
import com.example.chat.dto.MessageDTO;
import com.example.chat.dto.UserDTO;
import com.example.chat.model.ChatMessage;
import com.example.chat.model.ChatRoom;
import com.example.chat.model.User;
import com.example.chat.repository.ChatMessageRepository;
import com.example.chat.repository.ChatRoomRepository;
import com.example.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository messageRepository;
    private final ChatRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RedisPublisher redisPublisher;

    @Autowired
    public ChatService(ChatMessageRepository messageRepository,
                       ChatRoomRepository roomRepository,
                       UserRepository userRepository,
                       RedisPublisher redisPublisher) {
        this.messageRepository = messageRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.redisPublisher = redisPublisher;
    }

    @Transactional
    public MessageDTO processAndSaveMessage(MessageDTO dto) {
        if (dto.getTimestamp() == null) {
            dto.setTimestamp(LocalDateTime.now());
        }

        // Save to Database (PostgreSQL / H2)
        ChatMessage entity = new ChatMessage(
                dto.getType(),
                dto.getContent(),
                dto.getSender(),
                dto.getSenderAvatar(),
                dto.getRoomId()
        );
        entity.setTimestamp(dto.getTimestamp());
        
        ChatMessage saved = messageRepository.save(entity);
        dto.setId(saved.getId());

        // Publish to Redis (which broadcasts to WebSocket subscribers)
        redisPublisher.publish(dto);

        return dto;
    }

    public List<MessageDTO> getRoomHistory(String roomId) {
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId)
                .stream()
                .map(msg -> {
                    MessageDTO dto = new MessageDTO(
                            msg.getType(),
                            msg.getContent(),
                            msg.getSender(),
                            msg.getSenderAvatar(),
                            msg.getRoomId()
                    );
                    dto.setId(msg.getId());
                    dto.setTimestamp(msg.getTimestamp());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ChatRoom> getAllRooms() {
        List<ChatRoom> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            // Seed default rooms if empty
            rooms = List.of(
                createRoom(new CreateRoomRequest("General Lounge", "Main public discussion room")),
                createRoom(new CreateRoomRequest("Tech Talk", "Discuss Spring Boot, React, and Redis")),
                createRoom(new CreateRoomRequest("Random Chat", "Fun casual conversations"))
            );
        }
        return rooms;
    }

    public ChatRoom createRoom(CreateRoomRequest request) {
        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        if (roomRepository.existsByRoomId(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 4);
        }
        ChatRoom room = new ChatRoom(slug, request.getName(), request.getDescription());
        return roomRepository.save(room);
    }

    @Transactional
    public User registerOrUpdateUser(UserDTO dto) {
        return userRepository.findByUsername(dto.getUsername())
                .map(user -> {
                    user.setAvatarUrl(dto.getAvatarUrl());
                    user.setOnline(true);
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    User newUser = new User(dto.getUsername(), dto.getAvatarUrl());
                    newUser.setOnline(true);
                    return userRepository.save(newUser);
                });
    }

    public List<User> getOnlineUsers() {
        return userRepository.findByOnlineTrue();
    }

    @Transactional
    public void setUserOffline(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setOnline(false);
            userRepository.save(user);
        });
    }
}
