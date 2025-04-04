import {SOCKET_URL} from '@/utils/config'
let statusSocket: WebSocket | null = null;
let randomSocket: WebSocket | null = null;
let chatSocket: WebSocket | null = null; // This should be used globally for the chat connection
let omegleChatSocket: WebSocket | null = null; // This should be used globally for the chat connection
let directChatSocket: WebSocket | null = null; // This should be used globally for the chat connection
let omegleSocket: WebSocket | null = null;
/**
 * Connect to a WebSocket for a specific type and token.
 * @param token - The user token.
 * @param type - The type of WebSocket connection.
 */

export const connectDirectChat = (token: string, receiverId: string): void => {
  const wsUrl = `${SOCKET_URL}ws/direct/${token}/${receiverId}`;

  if (!directChatSocket || directChatSocket.readyState !== WebSocket.OPEN) {
    directChatSocket = new WebSocket(wsUrl);

    directChatSocket.onopen = () => {
      console.log(`[Direct Chat] Connected to WebSocket: ${wsUrl}`);
    };

    directChatSocket.onmessage = (event) => {
      console.log("[Direct Chat] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    directChatSocket.onclose = () => {
      console.log("[Direct Chat] WebSocket disconnected.");
    };

    directChatSocket.onerror = (error) => {
      console.log("[Direct Chat] WebSocket error:", error);
    };
  }
};

export const connectWebSocket = (token: string, type: string): void => {
  const url = `${SOCKET_URL}ws/status/${token}/${type}`;
  if (!statusSocket || statusSocket.readyState !== WebSocket.OPEN) {
    statusSocket = new WebSocket(url);

    statusSocket.onopen = () => {
      // console.log(`[Status WebSocket] Connected to WebSocket: ${url}`);
    };

    statusSocket.onmessage = (event) => {
      // console.log("[Status WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    statusSocket.onclose = () => {
      // console.log("[Status WebSocket] Disconnected from WebSocket");
    };

    statusSocket.onerror = (error) => {
      console.log("[Status WebSocket] WebSocket error:", error);
    };
  }
};

/**
 * Connect to a random match WebSocket for a specific token.
 * @param token - The user token.
 */
export const randomConnectWebSocket = (token: string): void => {
  const url = `${SOCKET_URL}ws/random/${token}`;
  if (!randomSocket || randomSocket.readyState !== WebSocket.OPEN) {
    randomSocket = new WebSocket(url);

    randomSocket.onopen = () => {
      // console.log(`[Random WebSocket] Connected to WebSocket: ${url}`);
    };

    randomSocket.onmessage = (event) => {
      // console.log("[Random WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    randomSocket.onclose = () => {
      // console.log("[Random WebSocket] Disconnected from WebSocket");
    };

    randomSocket.onerror = (error) => {
      console.log("[Random WebSocket] WebSocket error:", error);
    };
  }
};


/**
 * Connect to a random match WebSocket for a specific token.
 * @param token - The user token.
 */
export const OmegleConnectWebSocket = (ip: string, name: string, age: number): void => {
  const url = `${SOCKET_URL}ws/omegle/${ip}/${name}/${age}`;
  if (!omegleSocket || omegleSocket.readyState !== WebSocket.OPEN) {
    omegleSocket = new WebSocket(url);

    omegleSocket.onopen = () => {
      console.log(`[Omegle WebSocket] Connected to WebSocket: ${url}`);
    };

    omegleSocket.onmessage = (event) => {
      console.log("[Random WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    omegleSocket.onclose = () => {
      // console.log("[Random WebSocket] Disconnected from WebSocket");
    };

    omegleSocket.onerror = (error) => {
      console.log("[Random WebSocket] WebSocket error:", error);
    };
  }
};

/**
 * Disconnect the WebSocket connection if it is open.
 */
export const disconnectWebSocket = (socket: WebSocket | null): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // console.log("[WebSocket] Closing connection");
    socket.close();
  } else {
    console.warn("[WebSocket] WebSocket is already disconnected or not initialized");
  }
};

export const startChat = async (token: string, roomId: string): Promise<void> => {
  try {
    // Construct WebSocket URL
    const wsUrl = `${SOCKET_URL}ws/chat/${token}/${roomId}`;

    // Use the global `chatSocket` to store the chat WebSocket connection
    chatSocket = new WebSocket(wsUrl);

    // Event handler for when WebSocket connection opens
    chatSocket.onopen = () => {
      // console.log("[Dms Consumer] WebSocket connection established!");
      // Optionally send any initial messages here
    };

    // Event handler for receiving messages
    chatSocket.onmessage = (event: MessageEvent) => {
      // const messageData = JSON.parse(event.data);

      // Handle the incoming message based on your use case
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));

      // console.log("[Dms Consumer] Received message:", messageData);
    };

    // Event handler for when WebSocket connection closes
    chatSocket.onclose = () => {
      // console.log("[Dms Consumer] WebSocket connection closed.");
    };

    // Event handler for errors
    chatSocket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

  } catch (error) {
    console.log("Error starting chat:", error);
  }
};


export const startOmegleChat = async (roomId: string, name: string): Promise<void> => {
  try {
    // Construct WebSocket URL
    const wsUrl = `${SOCKET_URL}ws/omegle-chat/${roomId}/${name}`;

    // Use the global `chatSocket` to store the chat WebSocket connection
    omegleChatSocket = new WebSocket(wsUrl);

    // Event handler for when WebSocket connection opens
    omegleChatSocket.onopen = () => {
      console.log("[Omegle Dms Consumer] WebSocket connection established!");
      // Optionally send any initial messages here
    };
    
    // Event handler for receiving messages
    omegleChatSocket.onmessage = (event: MessageEvent) => {
      const messageData = JSON.parse(event.data);
      console.log("[Omegle Dms Consumer] received data : ", messageData);

      // Handle the incoming message based on your use case
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));

      console.log("[Omegle Dms Consumer] Received message:", messageData);
    };

    // Event handler for when WebSocket connection closes
    omegleChatSocket.onclose = () => {
      console.log("[Omegle Dms Consumer] WebSocket connection closed.");
    };

    // Event handler for errors
    omegleChatSocket.onerror = (error) => {
      console.log("[Omegle Dms Consumer] WebSocket error:", error);
    };

  } catch (error) {
    console.log("[Omegle Dms Consumer] Error starting chat:", error);
  }
};


export default startChat;

 // Disconnect all WebSockets
 export const disconnectAll = async () => {
  disconnectWebSocket(chatSocket);
  disconnectWebSocket(statusSocket);
  disconnectWebSocket(randomSocket);
  disconnectWebSocket(omegleChatSocket);
  disconnectWebSocket(directChatSocket);
  disconnectWebSocket(omegleSocket);
  
  // Optionally wait for disconnection or perform any cleanup here
  // console.log("Disconnected all WebSockets.");
};

interface Message {
  content: string;  // Ensure 'content' is required
  user?: string;    // Optional field
  sender?: string;  // Optional field
  roomName?: string
}

/**
 * Send a message through the WebSocket connection.
 * @param message - The message object to send.
 */
export const sendMessage = async (message: Message): Promise<void> => {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    try {
      const content = message?.content;  // Ensure 'content' is part of the message
      if (!content) {
        throw new Error("Message content is missing");
      }

      // console.log("[WebSocket] Sending message:", message);

      // Include the necessary fields such as user, timestamp, etc.
      const formattedMessage = {
        user: message.user || "default_user",  // You can set user here or from context
        sender: message.sender || "default_sender",  // Similarly, set sender if not provided
        timestamp: new Date().toISOString(),  // Using ISO string for timestamp
        content: content,
      };
      console.log('++++++++++++++++++', formattedMessage);
      chatSocket.send(JSON.stringify(formattedMessage));  // Send the structured message
    } catch (error) {
      console.log("[WebSocket] Error sending message:", error);
    }
  } else {
    console.log("[WebSocket] Cannot send message, WebSocket is not connected");
  }
};


/**
 * Send a message through the WebSocket connection.
 * @param message - The message object to send.
 */
export const sendOmegleMessage = async (message: Message): Promise<void> => {
  if (omegleChatSocket && omegleChatSocket.readyState === WebSocket.OPEN) {
    try {
      const content = message?.content;  // Ensure 'content' is part of the message
      if (!content) {
        throw new Error("Message content is missing");
      }

      // Include the necessary fields such as user, timestamp, etc.
      const formattedMessage = {
        sender: message.sender || "default_sender",  // Similarly, set sender if not provided
        timestamp: new Date().toISOString(),  // Using ISO string for timestamp
        content: content,
        roomName: message.roomName || "empty",
      };
      console.log('++++++++++++++++++', formattedMessage);
      omegleChatSocket.send(JSON.stringify(formattedMessage));  // Send the structured message
    } catch (error) {
      console.log("[WebSocket] Error sending message:", error);
    }
  } else {
    console.log("[WebSocket] Cannot send message, WebSocket is not connected");
  }
};

export const generateRoomName = (username1: string, username2: string): string => {
  return `room_dm_${[username1, username2].sort().join("_")}`;
};


