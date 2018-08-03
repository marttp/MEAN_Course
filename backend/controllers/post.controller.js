const Post = require('../models/post.model');


exports.createPost = (req, res, next) => {
  // const post = req.body;
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })

  console.log(post);
  // console.log(req.userData);
  // return res.status(200).json({});

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
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
}


exports.updatePost = (req, res, next) => {
  // console.log(req.file);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })

  // console.log(post)

  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post)
    .then(result => {
      console.log(result)
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Update successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Couldn't update post!`
      })
    })
}


exports.deletePost = (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: "Post deleted!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching post failed'
      });
    });;
}


exports.getAllPosts = (req, res, next) => {
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

}


exports.getOnePosts = (req, res, next) => {
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
    .catch(err => {
      res.status(500).json({
        message: 'Fetching post failed'
      });
    });
}
