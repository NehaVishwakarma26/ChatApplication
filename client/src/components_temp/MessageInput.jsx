import React, { useState } from 'react';
import { HStack, Input, Button } from '@chakra-ui/react';
import axios from 'axios';

const MessageInput = ({ userId, selectedUserId, fetchMessages }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/api/messages', {
        senderId: userId,
        receiverId: selectedUserId,
        content: message,
      });

      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <HStack p="4" bg="gray.200">
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        flex="1"
      />
      <Button colorScheme="teal" onClick={handleSendMessage}>Send</Button>
    </HStack>
  );
};

export default MessageInput;
