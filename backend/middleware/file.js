
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


module.exports = multer({storage: storage}).single('image');