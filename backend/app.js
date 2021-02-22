const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

//---------------------- Routes------------------//
const sauceRoutes = require('./routes/sauce_routes');
const userRoutes = require("./routes/user_routes");
const app = express();

//-----------------//mangoDB database replaced by Dotenv file-----//
mongoose.connect(process.env.MANGODb_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MangoDB connected wth new database for project06');
    })
    .catch((error) => {
        console.log("unable to connect MangoDB");
        console.error(error);
    });
//------------CORS Header ------------------//

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//----------------import POST request handeler POST Request--------------------//
app.use(bodyParser.json());

//implement routes // 

app.use('./images', express.static((__dirname, './images'))); //ToDo image folder , destination . 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;



