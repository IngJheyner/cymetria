import "reflect-metadata";
import "./container";
import App from "./app";

const PORT = process.env.PORT || 3000;
const server = new App(PORT);

server.listen();
