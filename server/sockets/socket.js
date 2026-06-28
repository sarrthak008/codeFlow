import { WebSocketServer, WebSocket } from "ws";

let socketServer = null;

const initSocketServer = (httpServer) => {
  try {
    socketServer = new WebSocketServer({
      server: httpServer,
      path: "/ws",
    });

    socketServer.on("connection", (ws) => {
      console.log("--- Socket Server Works ---");
      ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        // Broadcast to all connected clients
        socketServer.clients.forEach((client) => {
          if (client !== ws &&  client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: data.type,
                message: data.message,
              })
            );
          }
        });
      });

      ws.on("close", () => {
        console.log("Client Disconnected");
      });

      ws.on("error", (err) => {
        console.log(err);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const getSocketServer = () => socketServer;

export { initSocketServer, getSocketServer };