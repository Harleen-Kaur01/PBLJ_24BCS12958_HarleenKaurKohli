package com.freelancer.marketplace.service;

import com.freelancer.marketplace.dto.MessageRequest;
import com.freelancer.marketplace.dto.MessageResponse;
import com.freelancer.marketplace.entity.Message;
import com.freelancer.marketplace.entity.Project;
import com.freelancer.marketplace.entity.User;
import com.freelancer.marketplace.repository.MessageRepository;
import com.freelancer.marketplace.repository.ProjectRepository;
import com.freelancer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public MessageResponse sendMessage(MessageRequest request, String username) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElse(null);
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .project(project)
                .content(request.getContent())
                .build();

        Message savedMessage = messageRepository.save(message);
        return mapToResponse(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(Long otherUserId, String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Fetch all messages where currentUser is either sender or receiver
        List<Message> allMessages = messageRepository.findBySenderIdOrReceiverId(currentUser.getId(), currentUser.getId());

        // Filter for messages specifically with the otherUserId and sort by time
        return allMessages.stream()
                .filter(m -> 
                    (m.getSender().getId().equals(currentUser.getId()) && m.getReceiver().getId().equals(otherUserId)) ||
                    (m.getReceiver().getId().equals(currentUser.getId()) && m.getSender().getId().equals(otherUserId))
                )
                .sorted(Comparator.comparing(Message::getSentAt))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<User> getChatHistory(String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Message> allMessages = messageRepository.findBySenderIdOrReceiverId(currentUser.getId(), currentUser.getId());

        // Extract unique users we've chatted with
        return allMessages.stream()
                .map(m -> m.getSender().getId().equals(currentUser.getId()) ? m.getReceiver() : m.getSender())
                .distinct()
                .collect(Collectors.toList());
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .receiverId(message.getReceiver().getId())
                .receiverUsername(message.getReceiver().getUsername())
                .projectId(message.getProject() != null ? message.getProject().getId() : null)
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }
}
