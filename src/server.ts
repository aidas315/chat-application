import http from "http";
import app from "./app"; 
import "reflect-metadata";

const args = process.argv.slice(2);
const server = http.createServer(app);

args.forEach(arg => {
    let arr = arg.split("=");
    switch (arr[0].toLowerCase()) {
        case 'port':
            process.env.PORT = arr[1];
            break;
        case 'secret':
            process.env.SECRET_KEY = arr[1];
            break;
        case 'database':
            process.env.DB_CONN_STRING = arr[1];
            break;
        default:
            console.log('Allowed Arguments: port=123, secret=supersecret, database=uri');
    }
});

server.listen(process.env.PORT || 5000);