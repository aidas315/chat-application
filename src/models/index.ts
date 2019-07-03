import { connect } from "mongoose";
import { MongoError } from "mongodb";

connect(process.env.DB_CONN_STRING || "mongodb://localhost:27017/aidas", {
    useNewUrlParser: true,
}, (err: MongoError) => {
    if (err) throw err;
    console.log("Mongodb Connection Established.");
});

export { User } from "./User";