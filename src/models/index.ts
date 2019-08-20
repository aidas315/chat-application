import { connect } from "mongoose";
import { MongoError } from "mongodb";

connect(process.env.DB_CONN_STRING || "mongodb://localhost:27017/aidas", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err: MongoError) => {
    if (err) throw err;
    console.log("Mongodb Connection Established.");
});

export { User, UserSchema } from "./User";
export { Chat, ChatSchema } from "./Chat";