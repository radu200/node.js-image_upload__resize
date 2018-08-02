var express = require('express');
var router = express.Router();
const db = require('../config/database.js')
const multer = require('multer');
const sharp = require('sharp')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5e+6
  },
  fileFilter: fileFilter
});



/* GET home page. */
router.get('/', function (req, res, next) {
  db.query('select * from posts', function (err, results) {
    console.log(results)
  })
  res.render('index', {

  });
});

/* GET home page. */
router.get('/success', function (req, res, next) {
 
  res.render('success', {

  });

});

router.post('/posts', upload.single('image'), function (req, res, next) {

  if(req.file){
    var filename = req.file.filename;
    var filepath = req.file.path
   
    sharp(filepath)
    .resize(668,154)
    .toFile( './resized/' + req.file.filename, (err, info) => {
      console.log(info)
    });
    
  }else{
    filename = 'no-user.png' 
  }
  
  
 
  const posts = {
    image: filename,
    name:req.body.name
  }
  db.query('insert into posts  set ?', posts, function (err, ) {
     fs.unlink('./uploads/' +req.file.filename, function(err){
    if (err) {
      console.log("failed to delete file:" + err);
  } else {
      console.log('successfully deleted ');
  }
  })
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).json({
        message: "Posts Added",
        posts: {
          image: filename,
          name: req.body.name,
          size:5e+6
        }
      })
    
      
    }
  })

 
})

module.exports = router;