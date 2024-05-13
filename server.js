require("dotenv").config();
const express = require("express");
const server = express();

const PORT = process.env.PORT || 8000;

const connectToDatabase = require('./usedfiles/database')
connectToDatabase();

const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

server.use(session({
    secret: "StockGenius is Good!!",
    resave: false,
    saveUninitialized: false,
}));
server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders:['X-Total-Count'] 
}));
server.use(express.json());

const authentication = require("./router/authentication");
const user = require("./router/user");
const data = require("./router/data");

server.use('', authentication.router);
server.use('/userInfo', user.router);
server.use('/stock', data.router)

server.listen(PORT, ()=>{
    console.log(`Server Started at ${PORT}`);
});