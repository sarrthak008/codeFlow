import { toast } from "sonner";
let socket = null;
const WSS = import.meta.env.VITE_WSS_URL


export const connectSocket = () => {
  socket = new WebSocket(`${WSS}`);

  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    console.log(data)
    toast.info(data?.message,{
      duration : 3000
    });
  };

  socket.onclose = () => {
    console.log("Disconnected");
  };
};

export const getSocket = () => socket;