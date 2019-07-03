import http from "http";
import app from "./app"; 
import "reflect-metadata";

const server = http.createServer(app);

server.listen(process.env.PORT || 5000);