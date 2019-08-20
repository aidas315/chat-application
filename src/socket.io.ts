import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { Chat, User as UserModel } from "./models";
import {Connection, User, Message, Notification, NotificationType} from "./config/types";


let socketServer = (io: Server) : Server => {

    let connections: Connection[] = [];
    
    io.use((socket: Socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const token = socket.handshake.query.token;
            jwt.verify(token, process.env.SECRET_KEY || 'sup3rs3cr3t', (error: any, payload: Object) => {
                if (error) return next(new Error("Socket.io Authentication Error Occured."));
                socket.request.user = <User>payload;
            });
            next();
        } else {
            return next(new Error("Socket.io Authentication Error Occured."));
        }
    });
    
    io.on("connection", (socket: Socket) => {
        
        let connection: Connection = {
            socket: socket.id,
            user: socket.request.user
        };

        if (!connections.includes(connection)) connections.push(connection);
        
        // Getting Chat Notifications
        Chat.find({ reciever: socket.request.user, seenAt: null })
        .exec()
        .then(chats => {
            if (chats) {
                let notification: Notification = {
                    type: NotificationType.info,
                    message: "You recieved " + chats.length + " messages."
                };
                socket.emit("notification", notification);
            }
        });

        io.emit("online", socket.request.user._id); // Tell all clients about online status
        
        socket.on("message", (data: Message) => {
            if (data.message && data.reciever && socket.request.user._id != data.reciever) {
                let reciever = connections.filter(connection => connection.user._id == data.reciever)[0];
    
                UserModel.findById(data.reciever)
                .exec()
                .then(user => {
                    
                    if (user) {
                        new Chat({
                            sender: socket.request.user._id,
                            message: data.message,
                            reciever: user._id,
                        })
                        .save()
                        .then(chat => {
                            if (reciever) {
                                let message = chat.toObject();
                                delete message.deleted;
                                io.to(reciever.socket).emit("message", message);
                            }
                        }).catch(error => {
                            if (error) {                                
                                let notification: Notification = {
                                    type: NotificationType.error,
                                    message: "Sorry, Something went wrong on server."
                                };
                                socket.emit("notification", notification);
                            }
                        });
                    }
                }).catch(error => {
                    if (error) {
                        let notification: Notification = {
                            type: NotificationType.error,
                            message: "Sorry, Something went wrong on server."
                        };
                        socket.emit("notification", notification);
                    }
                });
            } else {
                let notification: Notification = {
                    type: NotificationType.error,
                    message: !data.reciever ? "You must select any of the persons then write message to send." : "Please write a message to send."
                }
                socket.emit("notification", notification);
            }
        });

        socket.on('typing', (colleague_id: string) => {
            let colleague = connections.filter(connection => connection.user._id == colleague_id)[0];
            (colleague && colleague.socket != socket.id) ? io.to(colleague.socket).emit('typing') : null;
        });

        socket.on("seen", (message_id: string) => {
            Chat.findOneAndUpdate(
                    { _id: message_id, reciever: socket.request.user._id },
                    { seenAt: Date.now() })
            .exec()
            .then(chat => {
                if (chat && chat.sender) {
                    let str: string = ""+chat.sender;
                    let sender = connections.filter(connection => chat.sender!.equals(connection.user._id))[0];                   
                    sender ? io.to(sender.socket).emit('seen', message_id) : null;
                }
            })
            .catch(error => {
                if (error) {
                    let notification: Notification = {
                        type: NotificationType.error,
                        message: "Sorry, Something went wrong on server."
                    };
                    socket.emit('notification', notification);
                }
            });
        });

        socket.on("delete-message", (message_id: string) => {
            Chat.findOneAndUpdate(
                { _id: message_id, reciever: socket.request.user._id },
                { deleted: true })
                .exec()
                .then(chat => {
                    if (chat && chat.sender) {
                        let sender = connections.filter(connection => chat.sender!.equals(connection.user._id))[0];
                        sender ? io.to(sender.socket).emit('message-deleted', message_id) : null;
                    }
                })
                .catch(error => {
                    if (error) {
                        let notification: Notification = {
                            type: NotificationType.error,
                            message: "Sorry, Something went wrong on server."
                        };
                        socket.emit('notification', notification);
                    }
                });
        });


        socket.on("disconnect", () => {
            connections = connections.filter(connection => connection.socket !== socket.id);
            io.emit("offline", socket.request.user._id); // Tell all clients about offline status
        });
    
    });
    return io;
};

export default socketServer;