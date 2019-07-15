import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

app.listen(3000, function () {
    console.log("Listening...");
});
app.use(cors({
    origin: ["http://localhost:4200"]
}));
/* Other middlewares and routes */



app.use((err, req, res, next) => {
    logger("SOME ERROR OCCURED");
    logger(err.stack.split('\n'));
    res.status(500).json({
        stack: err.stack.split('\n'),
        message: err.message
    });
});