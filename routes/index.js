var express = require('express');
var router = express.Router();
const db = require('../config/database.js')
const multer = require('multer');
const sharp = require('sharp')

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
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
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



router.post('/posts', upload.single('image'), function (req, res, next) {
  console.log(req.file)
  
  sharp(req.file.path)
  .resize(668,154)
  .toFile( './resized/' + req.file.filename, (err, info) => {
    console.log(info)
  });
  const posts = {
    image: req.file.filename,
    // name:req.body.name
  }
  db.query('insert into posts  set ?', posts, function (err, ) {

    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      // //console.log('res', results)
      res.status(200).json({
        message: "Posts Added",
        posts: {
          image: req.file.path,
          name: req.body.name

        }
      })

    }
  })

})

module.exports = router;