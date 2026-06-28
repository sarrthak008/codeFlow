import { getSocket } from "../socket";

export const broadcast = (type, payload = {}) => {
  const socket = getSocket();

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.log("Socket not connected");
    return;
  }

  socket.send(
    JSON.stringify({
      type,
      ...payload,
    })
  );
};