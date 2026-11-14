import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  TextField, 
  IconButton,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { messageService } from '../../services/messageService';

const ChatUI = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mocking current user since AuthContext isn't wired in this snippet
  // In a real app, get this from Context/Redux
  const currentUsername = localStorage.getItem('username'); 

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (activeContact) {
      loadConversation(activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = async () => {
    try {
      const data = await messageService.getChatHistory();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  const loadConversation = async (userId) => {
    setLoading(true);
    try {
      const data = await messageService.getConversation(userId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load conversation", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const sentMsg = await messageService.sendMessage(activeContact.id, newMessage);
      setMessages([...messages, sentMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '80vh', p: 2, gap: 2 }}>
      
      {/* Sidebar: Chat History */}
      <Paper elevation={3} sx={{ width: '30%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" fontWeight={600}>Messages</Typography>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {contacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <ListItem 
                button 
                selected={activeContact?.id === contact.id}
                onClick={() => setActiveContact(contact)}
                sx={{ 
                  '&.Mui-selected': { bgcolor: 'primary.light', color: 'white' },
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activeContact?.id === contact.id ? 'white' : 'primary.main', color: activeContact?.id === contact.id ? 'primary.main' : 'white' }}>
                    {contact.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={contact.username} 
                  secondary={contact.role}
                  primaryTypographyProps={{ fontWeight: 600 }}
                  secondaryTypographyProps={{ color: activeContact?.id === contact.id ? 'inherit' : 'text.secondary' }}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {contacts.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No past conversations.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Main Area: Active Conversation */}
      <Paper elevation={3} sx={{ width: '70%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
        {activeContact ? (
          <>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6">{activeContact.username}</Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#f8f9fa' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
              ) : messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
                  Send a message to start the conversation!
                </Typography>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.senderUsername === currentUsername;
                  return (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: isMine ? 'flex-end' : 'flex-start' 
                      }}
                    >
                      <Box 
                        sx={{ 
                          maxWidth: '70%', 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: isMine ? 'primary.main' : 'white', 
                          color: isMine ? 'white' : 'text.primary',
                          boxShadow: 1
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7 }}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ bgcolor: '#f1f3f4', borderRadius: 1, '& fieldset': { border: 'none' } }}
              />
              <IconButton color="primary" type="submit" disabled={!newMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" color="text.secondary">Select a contact to start chatting</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatUI;
