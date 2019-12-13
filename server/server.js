import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger } from './middlewares/logger.middleware';
import appRouter from './routes/app.routes';
import authRouter from '../server/routes/authentication.routes';
import ChatServer from '../server/chat-server/chatserver.class';


const app = express();
const socket = require('socket.io');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors({
    origin: ["http://localhost:4200"]
}));

/* Other middlewares and routes */

app.use("/chatapp", appRouter);
app.use("/authentication", authRouter);

app.use((err, req, res, next) => {
    logger("SOME ERROR OCCURED");
    logger(err.stack.split('\n'));
    res.status(500).json({
        stack: err.stack.split('\n'),
        message: err.message
    });
});

const server = app.listen(3000, function () {
    console.log("Listening...");
});

const cs = new ChatServer(server);
cs.getApp();
const io = socket(server);

io.use((socket, next) => {
    let clientId = socket.handshake.headers['x-clientid'];
    // if (isValid(clientId)) {
        return next();
    // }
    return next(new Error('authentication error'));
});

io.on('connection', (socket) => {
    logger("<-- SOCKET CONNECTION MADE -->")
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('establishConnection', (message) => {
        io.emit('connectionEstablished', { type: 'connectionEstablished', text: message });
    });
    socket.on('createRoom', (id) => {
        socket.join(id);
    });
    socket.on('sendMessageToConversation', (data) => {
        console.log(socket);
        io.to(data.conversationId).emit('emmitedMessage', {
            message: data.message
        });
    });
});
