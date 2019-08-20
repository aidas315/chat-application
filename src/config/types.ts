import { ObjectId } from "bson";

export enum NotificationType {
    info = "info",
    error = "error",
    success = "success",
    warning = "warning",
};

export interface User {
    _id: string,
    name: string,
    email: string,
    username: string,
    friends?: User[]
};

export interface Connection {
    user: User,
    socket: string,
};

export interface Message {
    sender?: string,
    message: string,
    reciever?: string,
};

export interface Notification {
    message: string,
    type: NotificationType
};
