package com.freelancer.marketplace.controller;

import com.freelancer.marketplace.dto.MessageRequest;
import com.freelancer.marketplace.dto.MessageResponse;
import com.freelancer.marketplace.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageRequest request, Principal principal) {
        try {
            return ResponseEntity.ok(messageService.sendMessage(request, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> getConversation(@PathVariable Long otherUserId, Principal principal) {
        return ResponseEntity.ok(messageService.getConversation(otherUserId, principal.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(Principal principal) {
        // Returns a list of users the current user has chatted with
        var users = messageService.getChatHistory(principal.getName()).stream()
            .map(user -> Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().name()
            )).collect(Collectors.toList());
            
        return ResponseEntity.ok(users);
    }
}
