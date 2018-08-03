const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

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
router.post('', 
  checkAuth, 
  multer({storage: storage}).single('image'),
  PostController
);

router.get('', PostController.getAllPosts);


router.get('/:id', PostController.getOnePosts);

router.put('/:id', 
  checkAuth, 
  multer({storage: storage}).single('image'),
  PostController.updatePost 
);


router.delete('/:id', checkAuth, PostController.deletePost );

module.exports = router;
