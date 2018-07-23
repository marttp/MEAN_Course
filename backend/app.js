const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://marttp:AIixP5AcZd0F4Sf8@mean-course-fmljg.mongodb.net/post?retryWrites=true')
    .then(()=>{
        console.log('Mongoose Connect to Mongo Atlas');
    })
    .catch(()=>{
        console.log('Not connect to Mongo Atlas');
    })
// AIixP5AcZd0F4Sf8
const Post = require('./models/post.model')

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

app.use((req, res, next) => {
    console.log('First Middleware');
    next();
})


app.post('/api/posts',(req,res,next) => {
    // const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    console.log(post);
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message:'Post added successfully',
            postId: result._id
        });
    })
    .catch(err => {
        res.status(400).json({
            message:'Add unsuccessful'
        });
    })

});

app.get('/api/posts',(req,res,next) => {
    //return normal
    // res.send('Hello from express');

    //return json data


    // const posts = [
    //     {
    //         id:'test12345',
    //         title:'First server-side-post',
    //         content: 'This is coming from the server 1!'
    //     },
    //     {
    //         id:'test22345',
    //         title:'Second server-side-post',
    //         content: 'This is coming from the server 2!'
    //     },
    //     {
    //         id:'test32345',
    //         title:'Third server-side-post',
    //         content: 'This is coming from the server 3!'
    //     }
    // ];



    //just pass the json
    // res.json(posts);

    Post.find().exec()
    .then(documents => {
        console.log(documents);
        // const posts = documents;
        res.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: documents
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({
            message: 'Error for execute posts!',
        });
    })
    //pass modify type of json

});


app.get('/api/post/:id',(req,res,next) => {
    Post.findById(req.params.id)
    .then( post => {
       if(post){
            res.status(200).json(post);
       } else {
            res.status(400).json({
                message: 'Post not found!',
            });       
        }
    })

})

app.put('/api/posts/:id',(req,res,next) => {

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
        res.status(200).json({
            message: "Update successful!"
        });
    })
});


app.delete('/api/posts/:id',(req,res,next)=>{
    // console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted'
        });
    });

})



module.exports = app;