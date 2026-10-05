package com.example.chat.dto;

import com.example.chat.model.MessageType;
import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private MessageType type;
    private String content;
    private String sender;
    private String senderAvatar;
    private String roomId;
    private LocalDateTime timestamp;

    public MessageDTO() {}

    public MessageDTO(MessageType type, String content, String sender, String senderAvatar, String roomId) {
        this.type = type;
        this.content = content;
        this.sender = sender;
        this.senderAvatar = senderAvatar;
        this.roomId = roomId;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getSenderAvatar() { return senderAvatar; }
    public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
