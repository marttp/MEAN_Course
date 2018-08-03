const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
// throw middleware between them

router.post('', checkAuth, extractFile, PostController.createPost);

router.get('', PostController.getAllPosts);

router.get('/:id', PostController.getOnePosts);

router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
