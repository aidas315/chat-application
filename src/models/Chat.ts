import { UserSchema } from './index';
import {
    prop, Typegoose, pre
} from 'typegoose';
import { ObjectId } from "bson";

@pre<ChatSchema>("save", function (next) {
    next()
})

export class ChatSchema extends Typegoose {
    @prop({ required: true, ref: "users" })
        sender?: ObjectId;
    @prop({ required: true, ref: "users" })
        reciever?: ObjectId;
    @prop({ required: true })
        message?: string;
    @prop({ default: false })
        deleted?: boolean;
    @prop({ ref: "chat" })
        reply?: ObjectId;
    @prop({ default: Date.now() })
        createdAt?: Date    
    @prop({ default: Date.now() })
        updatedAt?: Date    
    @prop({ default: null })
        seenAt?: Date    
};

export const Chat = new ChatSchema().getModelForClass(ChatSchema, {
    schemaOptions: {
        timestamps: true,
        collection: "chat"
    }
});