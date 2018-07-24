const express = require('express');

const router = express.Router();

const Post = require('../models/post.model');


router.post('',(req,res,next) => {
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

router.get('',(req,res,next) => {
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


router.get('/:id',(req,res,next) => {
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

router.put('/:id',(req,res,next) => {

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


router.delete('/:id',(req,res,next)=>{
    // console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted'
        });
    });

})


module.exports = router;