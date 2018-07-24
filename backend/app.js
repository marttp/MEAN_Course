const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://marttp:AIixP5AcZd0F4Sf8@mean-course-fmljg.mongodb.net/post?retryWrites=true',{ useNewUrlParser: true })
    .then(()=>{
        console.log('Mongoose Connect to Mongo Atlas');
    })
    .catch(()=>{
        console.log('Not connect to Mongo Atlas');
    })
// AIixP5AcZd0F4Sf8

const postsRoutes = require('./routes/posts')

app.use((req,res,next) => {
    // allow access resource
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// })
app.use("/api/posts", postsRoutes);


module.exports = app;