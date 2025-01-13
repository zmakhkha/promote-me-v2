let socket: WebSocket | null = null;

/**
 * Connect to a WebSocket for a specific type and token.
 * @param token - The user token.
 * @param type - The type of WebSocket connection.
 */
export const connectWebSocket = (token: string, type: string): void => {
  const url = `ws://localhost:2000/ws/status/${token}/${type}`;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(`[Status WebSocket] Connected to WebSocket: ${url}`);
    };

    socket.onmessage = (event) => {
      console.log("[Status WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    socket.onclose = () => {
      console.log("[Status WebSocket] Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
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
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(`[Random WebSocket] Connected to WebSocket: ${url}`);
    };

    socket.onmessage = (event) => {
      console.log("[Random WebSocket] Message received:", event.data);
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    socket.onclose = () => {
      console.log("[Random WebSocket] Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
      console.error("[Random WebSocket] WebSocket error:", error);
    };
  }
};

/**
 * Send a message through the WebSocket connection.
 * @param message - The message object to send.
 */
export const sendMessage = (message: Record<string, any>): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("[WebSocket] Sending message:", message);
    socket.send(JSON.stringify(message));
  } else {
    console.error("[WebSocket] Cannot send message, WebSocket is not connected");
  }
};

/**
 * Disconnect the WebSocket connection if it is open.
 */
export const disconnectWebSocket = (): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("[WebSocket] Closing connection");
    socket.close();
  } else {
    console.warn("[WebSocket] WebSocket is already disconnected or not initialized");
  }
};
