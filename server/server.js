import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger } from './middlewares/logger.middleware';
import appRouter from './router/app.router';

const app = express();
const socket = require('socket.io');

app.use(cors({
    origin: ["http://localhost:4200"]
}));
/* Other middlewares and routes */

app.use("/chatapp", appRouter);
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
const io = socket(server);

io.on('connection', (socket) => {
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('add-message', (message) => { 
        io.emit('message', { type: 'new-message', text: message });
    });

});