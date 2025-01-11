let socket: WebSocket | null = null;

export const connectWebSocket = (token: string, type: string): void => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket('ws://localhost:8000/ws/status/${token}/${type}');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
};

/**
 * Disconnects from the WebSocket server.
 */
export const disconnectWebSocket = (): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};

/**
 * Sends a message to the WebSocket server.
 * @param message - The message to send.
 */
export const sendMessage = (message: Record<string, any>): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
};
