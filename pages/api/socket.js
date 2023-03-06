// import { Server } from 'Socket.IO'
import { fullSiteScrape, singleSiteScrape } from './webscrapper'
import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("Client connected");

    socket.on("full-site-scrap", async (url) => {
      const p = await fullSiteScrape(url, socket);
    });

    socket.on("single-site-scrap", async (url) => {
      const p = await singleSiteScrape(url, socket);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}