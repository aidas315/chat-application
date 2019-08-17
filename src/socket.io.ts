import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

let socketServer = (io: Server) : Server => {
    io.use((socket: Socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const token = socket.handshake.query.token;
            jwt.verify(token, process.env.SECRET_KEY || 'sup3rs3cr3t', (error: any, payload: Object) => {
                if (error) return next(new Error("Socket.io Authentication Error Occured."));
                socket.request.user = payload;
            });
            next();
        } else {
            return next(new Error("Socket.io Authentication Error Occured."));
        }
    });
    io.on("connection", (socket: Socket) => {
        console.log("Welcome " + socket.request.user.name)
        socket.emit("message", "Welcome " + socket.request.user.name);
        socket.on("message", (message) => {
            console.log(message);
        })
    });
    return io;
};

export default socketServer;