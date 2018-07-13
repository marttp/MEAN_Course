const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Post = require('./models/post.model')

app.use((req,res,next) => {
    // allow access resource
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    console.log('First Middleware');
    next();
})

// AIixP5AcZd0F4Sf8

app.post('/api/posts',(req,res,next) => {
    // const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    console.log(post);
    res.status(201).json({
        message:'Post added successfully'
    });
});

app.get('/api/posts',(req,res,next) => {
    //return normal
    // res.send('Hello from express');

    //return json data
    const posts = [
        {
            id:'test12345',
            title:'First server-side-post',
            content: 'This is coming from the server 1!'
        },
        {
            id:'test22345',
            title:'Second server-side-post',
            content: 'This is coming from the server 2!'
        },
        {
            id:'test32345',
            title:'Third server-side-post',
            content: 'This is coming from the server 3!'
        }
    ];

    //just pass the json
    // res.json(posts);

    //pass modify type of json
    res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: posts
    });
});

module.exports = app;