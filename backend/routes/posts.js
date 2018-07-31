const express = require('express');

const router = express.Router();

const Post = require('../models/post.model');
const checkAuth = require('../middleware/check-auth');

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  // js object for diskStorage have 2 keys : destination and filename
  // execute when multer try to save a file
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid){
        error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    // add extension for check filename
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + '.' + ext);
  }
});

// throw middleware between them
router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  // const post = req.body;
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })
  console.log(post);
  post.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post added successfully',
        post: {
            // ...result,
            id: result._id,
            title: result.title,
            content: result.content,
            imagePath: result.imagePath
        }
      });
    })
    .catch(err => {
      res.status(400).json({
        message: 'Add unsuccessful'
      });
    })

});

router.get('', (req, res, next) => {
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
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  //just pass the json
  // res.json(posts);
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.exec()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      // const posts = documents;
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: fetchedPosts,
        maxPosts: count
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


router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(400).json({
          message: 'Post not found!',
        });
      }
    })

})

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  // console.log(req.file);
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })

  console.log(post)

  Post.updateOne({
      _id: req.params.id
    }, post)
    .then(result => {
      res.status(200).json({
        message: "Update successful!"
      });
    })
});


router.delete('/:id', checkAuth, (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({
      _id: req.params.id
    })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Post deleted'
      });
    });

})


module.exports = router;
