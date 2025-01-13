// let socket: WebSocket | null = null;

// export const connectWebSocket = (token: string, type: string): void => {
//   if (!socket || socket.readyState !== WebSocket.OPEN) {
//     socket = new WebSocket(`ws://localhost:2000/ws/status/${token}/${type}`);

//     socket.onopen = () => {
//       console.log("status : Connected to WebSocket");
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   }
// };


// export const randomChatConnectWebSocket = (token: string): void => {
//   if (!socket || socket.readyState !== WebSocket.OPEN) {
//     socket = new WebSocket(`ws://localhost:2000/ws/random/${token}`);
    
//     socket.onopen = () => {
//       console.log("randomChatConnectWebSocket : Connected to WebSocket");
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   }
// };

// /**
//  * Disconnects from the WebSocket server.
//  */
// export const disconnectWebSocket = (): void => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.close();
//   }
// };

// /**
//  * Sends a message to the WebSocket server.
//  * @param message - The message to send.
//  */
// export const sendMessage = (message: Record<string, any>): void => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(message));
//   } else {
//     console.error("WebSocket is not connected");
//   }
// };

let socket: WebSocket | null = null;

export const connectWebSocket = (token: string, type: string): void => {
  const url = `ws://localhost:2000/ws/${type}/${token}`;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      window.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
};

export const sendMessage = (message: Record<string, any>): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not connected");
  }
};

export const disconnectWebSocket = (): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};
