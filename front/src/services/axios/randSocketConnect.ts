import {randomChatConnectWebSocket } from "./websocketService";

  const randSocketConnect = () => {
	const token = localStorage.getItem("accessToken");

	randomChatConnectWebSocket(token || "");
  };

export default randSocketConnect