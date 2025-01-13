let socket: WebSocket | null = null;
let statusSocket: WebSocket | null = null;
let randomSocket: WebSocket | null = null;
let chatSocket: WebSocket | null = null; // This should be used globally for the chat connection

/**
 * Connect to a WebSocket for a specific type and token.
 * @param token - The user token.
 * @param type - The type of WebSocket connection.
 */
export const connectWebSocket = (token: string, type: string): void => {
  const url = `ws://localhost:2000/ws/status/${token}/${type}`;
  if (!statusSocket || statusSocket.readyState !== WebSocket.OPEN) {
    statusSocket = new WebSocket(url);

    statusSocket.onopen = () => {
      console.log(`[Status WebSocket] Connected to WebSocket: ${url}`);
    };

    statusSocket.onmessage = (event) => {
      console.log("[Status WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    statusSocket.onclose = () => {
      console.log("[Status WebSocket] Disconnected from WebSocket");
    };

    statusSocket.onerror = (error) => {
      console.error("[Status WebSocket] WebSocket error:", error);
    };
  }
};

/**
 * Connect to a random match WebSocket for a specific token.
 * @param token - The user token.
 */
export const randomConnectWebSocket = (token: string): void => {
  const url = `ws://localhost:2000/ws/random/${token}`;
  if (!randomSocket || randomSocket.readyState !== WebSocket.OPEN) {
    randomSocket = new WebSocket(url);

    randomSocket.onopen = () => {
      console.log(`[Random WebSocket] Connected to WebSocket: ${url}`);
    };

    randomSocket.onmessage = (event) => {
      console.log("[Random WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    randomSocket.onclose = () => {
      console.log("[Random WebSocket] Disconnected from WebSocket");
    };

    randomSocket.onerror = (error) => {
      console.error("[Random WebSocket] WebSocket error:", error);
    };
  }
};

/**
 * Disconnect the WebSocket connection if it is open.
 */
export const disconnectWebSocket = (socket: WebSocket | null): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("[WebSocket] Closing connection");
    socket.close();
  } else {
    console.warn("[WebSocket] WebSocket is already disconnected or not initialized");
  }
};

const startChat = async (token: string, roomId: string): Promise<void> => {
  try {
    // Construct WebSocket URL
    const wsUrl = `ws://localhost:2000/ws/chat/${token}/${roomId}`;

    // Use the global `chatSocket` to store the chat WebSocket connection
    chatSocket = new WebSocket(wsUrl);

    // Event handler for when WebSocket connection opens
    chatSocket.onopen = () => {
      console.log("[Dms Consumer] WebSocket connection established!");
      // Optionally send any initial messages here
    };

    // Event handler for receiving messages
    chatSocket.onmessage = (event: MessageEvent) => {
      const messageData = JSON.parse(event.data);

      // Handle the incoming message based on your use case
      console.log("Received message:", messageData);
    };

    // Event handler for when WebSocket connection closes
    chatSocket.onclose = () => {
      console.log("[Dms Consumer] WebSocket connection closed.");
    };

    // Event handler for errors
    chatSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

  } catch (error) {
    console.error("Error starting chat:", error);
  }
};

export default startChat;

/**
 * Send a message through the WebSocket connection.
 * @param message - The message object to send.
 */
export const sendMessage = async (message: Record<string, any>): Promise<void> => {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    try {
      const content = message?.content;  // Ensure 'content' is part of the message
      if (!content) {
        throw new Error("Message content is missing");
      }

      console.log("[WebSocket] Sending message:", message);

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
      console.error("[WebSocket] Error sending message:", error);
    }
  } else {
    console.error("[WebSocket] Cannot send message, WebSocket is not connected");
  }
};

