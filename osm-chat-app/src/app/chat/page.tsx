'use client'; // Required for Next.js App Router client components

import { AssistantRuntimeProvider, useEnterSubmit } from '@assistant-ui/react';
import { AssistantUI, ChatViewMessage } from '@assistant-ui/react-ui-shadcn';
import { useEffect, useState } from 'react';

// A simple, static thread and assistant ID for now
const threadId = 'my-chat-thread-01';
const assistantId = 'osm-assistant-v1';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);
  const { register, onKeyDown } = useEnterSubmit();

  const handleSend = async (text: string) => {
    const newMessage: ChatViewMessage = {
      id: crypto.randomUUID(), // Simple unique ID
      createdAt: new Date(),
      role: 'user',
      content: [{ type: 'text', text }],
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();

      const assistantMessage: ChatViewMessage = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        role: 'assistant',
        content: [{ type: 'text', text: data.reply || 'No reply from assistant.' }],
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error('Failed to send message or get reply:', error);
      const errorMessage: ChatViewMessage = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        role: 'assistant',
        content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // This is a simplified setup.
  // AssistantRuntimeProvider would typically wrap more of your application
  // and manage state more globally if needed.
  // For this example, we're keeping it contained.

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AssistantRuntimeProvider
        threadId={threadId}
        assistantId={assistantId}
        // onRunUpdate is more for streaming updates, which we aren't fully using here yet
        // onToolCall is for handling tool calls from the assistant
      >
        <AssistantUI
          messages={messages}
          onSend={handleSend}
          // inputProps can be used to customize the input field
          inputProps={{
            ...register('chat-input'), // From useEnterSubmit
            onKeyDown, // From useEnterSubmit
            placeholder: 'Ask about OpenStreetMap...',
          }}
          // chatContainerProps, etc., can be used for further styling
        />
      </AssistantRuntimeProvider>
    </div>
  );
}
