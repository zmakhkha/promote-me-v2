import { connectWebSocket } from "./websocketService";

  const socketConnect = (type : string) => {
	const token = localStorage.getItem("accessToken");
	const _type = type || "1";
	// console.log(token);

	connectWebSocket(token || "", _type);
  };

export default socketConnect