import cors from "cors";
import morgan from "morgan";
import express from "express";
import router from "./routes/index";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(router);

export default app;