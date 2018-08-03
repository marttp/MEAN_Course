const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://marttp:' + process.env.MONGO_ATLAS_PW + '@mean-course-fmljg.mongodb.net/post',{ useNewUrlParser: true })
    .then(()=>{
        console.log('Mongoose Connect to Mongo Atlas');
    })
    .catch(()=>{
        console.log('Not connect to Mongo Atlas');
    })
// AIixP5AcZd0F4Sf8

const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


app.use((req,res,next) => {
    // allow access resource
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// any request targeting to fetch files
app.use("/images", express.static(path.join('backend/images')));
// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// })
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;